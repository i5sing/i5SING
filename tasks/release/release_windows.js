'use strict';
const logger = require('../log');
const childProcess = require('child_process');
const jetPack = require('fs-jetpack');
const asar = require('asar');
const utils = require('../utils');

let projectDir;
let tmpDir;
let releasesDir;
let readyAppDir;
let manifest;

function init() {
    return new Promise(resolve => {
        projectDir = jetPack;
        tmpDir = projectDir.dir('./tmp', {empty: true});
        releasesDir = projectDir.dir('./releases');
        manifest = projectDir.read('src/package.json', 'json');
        readyAppDir = tmpDir.cwd(manifest.name);
        resolve();
    })
}

function copyRuntime() {
    return projectDir.copyAsync('node_modules/electron/dist', readyAppDir.path(), {overwrite: true});
}

function cleanupRuntime() {
    return readyAppDir.removeAsync('resources/default_app');
}

function packageBuiltApp() {
    return new Promise(resolve => {
        asar.createPackage(projectDir.path('build'), readyAppDir.path('resources/app.asar'), resolve)
    })
}

function finalize() {
    return new Promise(resolve => {
        projectDir.copy('src/resources/windows/icon.ico', readyAppDir.path('icon.ico'));

        // Replace Electron icon for your own.
        const rcedit = require('rcedit');
        rcedit(readyAppDir.path('electron.exe'), {
            'icon': projectDir.path('src/resources/windows/icon.ico'),
            'version-string': {
                'ProductName': manifest.productName,
                'FileDescription': manifest.description,
            }
        }, function (err) {
            if (!err) {
                resolve();
            }
        });
    });
}

function renameApp() {
    return readyAppDir.renameAsync('electron.exe', manifest.productName + '.exe');
}

function createInstaller() {
    return new Promise(resolve => {
        const finalPackageName = manifest.name + '_' + manifest.version + '.exe';
        let installScript = projectDir.read('src/resources/windows/installer.nsi');
        installScript = utils.replace(installScript, {
            name: manifest.name,
            productName: manifest.productName,
            version: manifest.version,
            src: readyAppDir.path(),
            dest: releasesDir.path(finalPackageName),
            icon: readyAppDir.path('icon.ico'),
            setupIcon: projectDir.path('src/resources/windows/setup-icon.ico'),
            banner: projectDir.path('src/resources/windows/setup-banner.bmp'),
        });
        tmpDir.write('installer.nsi', installScript);

        logger.log('Building installer with NSIS...');

        // Remove destination file if already exists.
        releasesDir.remove(finalPackageName);

        // Note: NSIS have to be added to PATH (environment variables).
        const nsis = childProcess.spawn('makensis', [
            tmpDir.path('installer.nsi')
        ], {
            stdio: 'inherit'
        });
        nsis.on('error', function (err) {
            if (err.message === 'spawn makensis ENOENT') {
                throw "Can't find NSIS. Are you sure you've installed it and"
                + " added to PATH environment variable?";
            } else {
                throw err;
            }
        });
        nsis.on('close', function () {
            logger.log('Installer ready!', releasesDir.path(finalPackageName));
            resolve();
        });
    })
}

function cleanClutter() {
    return tmpDir.removeAsync('.');
}

module.exports = function () {
    return init()
        .then(copyRuntime)
        .then(cleanupRuntime)
        .then(packageBuiltApp)
        .then(finalize)
        .then(renameApp)
        .then(createInstaller)
        .then(cleanClutter)
        .catch(console.error);
};
