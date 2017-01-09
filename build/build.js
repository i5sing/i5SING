/**
 * Created by feng on 24/12/2016.
 */
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.proc');
const packager = require('electron-packager');

compile();
packageDarwin();
packageWin32();

function compile() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, function (err, stats) {
            if (err) {
                reject(err);
            }

            console.log(stats.toString({modules: false, colors: true}));
            resolve();
        });
    })
}

function packageDarwin() {
    return new Promise((resolve, reject) => {
        packager({
            arch: 'all',
            icon: './dist/assets/img/logo.icns',
            dir: './dist',
            out: 'release',
            name: 'i5SING',
            version: '1.4.12',
            platform: 'darwin',
            overwrite: true
        }, function (err, appPath) {
            if (err) return reject(err);
            if (appPath) {
                resolve();
            }
        });
    });
}

function packageWin32() {
    return new Promise((resolve, reject) => {
        packager({
            arch: 'all',
            icon: './dist/assets/logo.ico',
            dir: './dist',
            out: 'release',
            name: 'i5SING',
            version: '1.4.12',
            platform: 'win32',
            overwrite: true
        }, function (err, appPath) {
            if (err) return reject(err);
            if (appPath) {
                resolve();
            }
        });
    });
}