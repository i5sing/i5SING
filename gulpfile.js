/**
 * Created by zhaofeng on 7/18/16.
 */
"use strict";
var gulp = require('gulp');
var clean = require('gulp-clean');
var install = require("gulp-install");
var packager = require('electron-packager');
var webpack = require('webpack');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

var webpackConfig = require('./build/webpack.config.proc'),
    webpackConfigForDev = require('./build/webpack.config');

gulp.task('clean', () => {
    return gulp.src(['./dist'], {read: false})
        .pipe(clean());
});

gulp.task('copy-assets', ['clean'], () => {
    return gulp.src(['./app/assets/img/**'])
        .pipe(gulp.dest('./dist/assets/img'));
});

gulp.task('copy-files', ['copy-assets'], () => {
    return gulp.src([
        './package.json',
        './app/index.js'
    ]).pipe(gulp.dest('./dist'));
});

gulp.task('copy-main', ['copy-files'], () => {
    return gulp.src([
        './app/main/**'
    ]).pipe(gulp.dest('./dist/main'));
});

gulp.task('copy-common', ['copy-main'], () => {
    return gulp.src([
        './app/common/**'
    ]).pipe(gulp.dest('./dist/common'));
});

gulp.task('copy-modules', ['copy-common'], () => {
    return gulp.src(['./node_modules/sqlite3/**'])
        .pipe(gulp.dest('./dist/node_modules/sqlite3'));
});

gulp.task('copy', ['copy-modules'], callback => {
    callback();
});

gulp.task('install', ['copy'], () => {
    return gulp.src('./dist/package.json')
        .pipe(gulp.dest('./dist'))
        .pipe(install({production: true}));
});

gulp.task('compile', ['copy'], callback => {
    webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({modules: false, colors: true}));
        callback();
    });
});

gulp.task('compile_dev', callback => {
    var start = false;

    webpack(webpackConfigForDev, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({modules: false, colors: true}));
        !start && callback();
        start && gutil.log('[recompile]', '编译成功');
        start = true;
    });
});


gulp.task('build_package', ['install', 'compile'], () => {

    //electron-packager ../dist 5sing --platform=all --arch=all --out=app --overwrite
    if (process.platform == 'darwin') {
        return new Promise((resolve, reject) => {
            packager({
                arch: 'all',
                icon: './dist/assets/img/logo.icns',
                dir: './dist',
                out: 'release',
                name: 'i5SING',
                version: '1.3.1',
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

    if (process.platform == 'win32') {
        return new Promise((resolve, reject) => {
            packager({
                arch: 'all',
                // TODO
                // mac os 10.12 无法安装wine
                // icon: '../dist/assets/logo.ico',
                dir: '../dist',
                out: 'release',
                name: 'i5SING',
                version: '1.3.1',
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
});

gulp.task('build', ['build_package'], () => {
    gutil.log('[build]', '打包成功!');
});

gulp.task('dev', ['compile_dev'], (callback) => {
    gutil.log('[run]', '启动成功!');
    callback();
    exec('NODE_ENV=dev electron ./app/index.js', err => {
        if (err) return gutil.log('[error]', err); // 返回 error
    });
});
