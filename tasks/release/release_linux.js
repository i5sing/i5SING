'use strict';

const logger = require('../log');
const childProcess = require('child_process');
const jetPack = require('fs-jetpack');
const asar = require('asar');
const utils = require('../utils');

let projectDir;
let releasesDir;
let packName;
let packDir;
let tmpDir;
let readyAppDir;
let manifest;

function init() {
    return new Promise(resolve => {
        projectDir = jetPack;
        tmpDir = projectDir.dir('./tmp', {empty: true});
        releasesDir = projectDir.dir('./releases');
        manifest = projectDir.read('src/package.json', 'json');
        packName = manifest.name + '_' + manifest.version;
        packDir = tmpDir.dir(packName);
        readyAppDir = packDir.cwd('opt', manifest.name);
        resolve();
    })
}

function copyRuntime() {
    return projectDir.copyAsync('node_modules/electron/dist', readyAppDir.path(), {overwrite: true});
}

function packageBuiltApp() {
    return new Promise(resolve => {
        asar.createPackage(projectDir.path('build'), readyAppDir.path('resources/app.asar'), resolve);
    })
}

function finalize() {
    // Create .desktop file from the template
    let desktop = projectDir.read('resources/linux/app.desktop');
    desktop = utils.replace(desktop, {
        name: manifest.name,
        productName: manifest.productName,
        description: manifest.description,
        version: manifest.version,
        author: manifest.author
    });
    packDir.write('usr/share/applications/' + manifest.name + '.desktop', desktop);

    // Copy icon
    projectDir.copy('resources/icon.png', readyAppDir.path('icon.png'));
}

function renameApp() {
    return readyAppDir.renameAsync("electron", manifest.name);
}

function packToDebFile() {

    const debFileName = packName + '_amd64.deb';
    const debPath = releasesDir.path(debFileName);

    logger.log('Creating DEB package...');

    // Counting size of the app in KiB
    const appSize = Math.round(readyAppDir.inspectTree('.').size / 1024);

    // Preparing debian control file
    let control = projectDir.read('resources/linux/DEBIAN/control');
    control = utils.replace(control, {
        name: manifest.name,
        description: manifest.description,
        version: manifest.version,
        author: manifest.author,
        size: appSize
    });
    packDir.write('DEBIAN/control', control);

    // Build the package...
    return new Promise(resolve => {
        childProcess.exec('fakeroot dpkg-deb -Zxz --build ' +
            packDir.path().replace(/\s/g, '\\ ') + ' ' + debPath.replace(/\s/g, '\\ '),
            (error, stdout, stderr) => {
                if (error || stderr) {
                    logger.log("ERROR while building DEB package:");
                    logger.log(error);
                    logger.log(stderr);
                } else {
                    logger.log('DEB package ready!', debPath);
                }
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
        .then(packageBuiltApp)
        .then(finalize)
        .then(renameApp)
        .then(packToDebFile)
        .then(cleanClutter)
        .catch(console.error);
};
