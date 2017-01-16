/**
 * Created by feng on 2017/1/13.
 */
'use strict';

const argv = require('yargs').argv;
const os = require('os');
const jetPack = require('fs-jetpack');

exports.os = function () {
    switch (os.platform()) {
        case 'darwin':
            return 'osx';
        case 'linux':
            return 'linux';
        case 'win32':
            return 'windows';
    }
    return 'unsupported';
};

exports.replace = function (str, patterns) {
    Object.keys(patterns).forEach(pattern => {
        str = str.replace(new RegExp('{{' + pattern + '}}', 'g'), patterns[pattern]);
    });
    return str;
};

exports.getEnvName = function () {
    return argv.env || 'development';
};

exports.getElectronVersion = function () {
    let manifest = jetPack.read(__dirname + '/../package.json', 'json');
    return manifest.dependencies['electron'].substring(1);
};