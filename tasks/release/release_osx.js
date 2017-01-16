'use strict';

const logger = require('../log');
const jetPack = require('fs-jetpack');
const asar = require('asar');
const utils = require('../utils');

let projectDir;
let releasesDir;
let tmpDir;
let finalAppDir;
let manifest;

function init() {
    return new Promise(resolve => {
        projectDir = jetPack;
        tmpDir = projectDir.dir('./tmp', {empty: true});
        releasesDir = projectDir.dir('./releases');
        manifest = projectDir.read('src/package.json', 'json');
        finalAppDir = tmpDir.cwd(manifest.productName + '.app');
        resolve();
    })
}

function copyRuntime() {
    return projectDir.copyAsync('node_modules/electron/dist/Electron.app', finalAppDir.path());
}

function cleanupRuntime() {
    finalAppDir.remove('Contents/Resources/default_app');
    finalAppDir.remove('Contents/Resources/atom.icns');
}

function packageBuiltApp() {
    return new Promise(resolve => {
        asar.createPackage(projectDir.path('build'), finalAppDir.path('Contents/Resources/app.asar'), resolve);
    });
}

function finalize() {
    // Prepare main Info.plist
    let info = projectDir.read('src/resources/osx/Info.plist');
    info = utils.replace(info, {
        productName: manifest.productName,
        identifier: manifest.identifier,
        version: manifest.version
    });
    finalAppDir.write('Contents/Info.plist', info);

    // Prepare Info.plist of Helper apps
    [' EH', ' NP', ''].forEach(helper_suffix => {
        info = projectDir.read('src/resources/osx/helper_apps/Info' + helper_suffix + '.plist');
        info = utils.replace(info, {
            productName: manifest.productName,
            identifier: manifest.identifier
        });
        finalAppDir.write('Contents/Frameworks/Electron Helper' + helper_suffix + '.app/Contents/Info.plist', info);
    });

    // Copy icon
    projectDir.copy('src/resources/osx/icon.icns', finalAppDir.path('Contents/Resources/icon.icns'));
}

function renameApp() {
    // Rename helpers
    [' Helper EH', ' Helper NP', ' Helper'].forEach(helper_suffix => {
        finalAppDir.rename('Contents/Frameworks/Electron' + helper_suffix +
            '.app/Contents/MacOS/Electron' + helper_suffix, manifest.productName + helper_suffix);
        finalAppDir.rename('Contents/Frameworks/Electron' + helper_suffix +
            '.app', manifest.productName + helper_suffix + '.app');
    });
    // Rename application
    finalAppDir.rename('Contents/MacOS/Electron', manifest.productName);
}

function packToDmgFile() {
    return new Promise(resolve => {
        const appdmg = require('appdmg');
        const dmgName = manifest.name + '_' + manifest.version + '.dmg';

        // Prepare appdmg config
        let dmgManifest = projectDir.read('src/resources/osx/appdmg.json');
        dmgManifest = utils.replace(dmgManifest, {
            productName: manifest.productName,
            appPath: finalAppDir.path(),
            dmgIcon: projectDir.path("src/resources/osx/dmg-icon.icns"),
            dmgBackground: projectDir.path("src/resources/osx/dmg-background.png")
        });
        tmpDir.write('appdmg.json', dmgManifest);

        // Delete DMG file with this name if already exists
        releasesDir.remove(dmgName);

        logger.log('Packaging to DMG file...');

        const readyDmgPath = releasesDir.path(dmgName);
        appdmg({source: tmpDir.path('appdmg.json'), target: readyDmgPath})
            .on('error', logger.error)
            .on('finish', () => {
                logger.log('DMG file ready!', readyDmgPath);
                resolve();
            });
    });
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
        .then(packToDmgFile)
        .then(cleanClutter)
        .catch(logger.error);
};
