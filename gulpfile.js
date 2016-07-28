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

var webpackConfig = require('./build/webpack.config.proc.js'),
    webpackConfigForDev = require('./build/webpack.config');

gulp.task('clean', () => {
    return gulp.src(['./dist'], {read: false})
        .pipe(clean());
});

gulp.task('copy-assets', ['clean'], () => {
    return gulp.src(['./src/assets/**'])
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy-files', ['copy-assets'], () => {
    return gulp.src([
        './src/index.js',
        './src/entry.js',
        './package.json'
    ]).pipe(gulp.dest('./dist'));
});

gulp.task('copy-backend', ['copy-files'], () => {
    return gulp.src(['./src/backend/**'])
        .pipe(gulp.dest('./dist/backend'));
});

gulp.task('copy-windows', ['copy-backend'], () => {
    return gulp.src(['./src/windows/**'])
        .pipe(gulp.dest('./dist/windows'));
});

gulp.task('copy-modules', ['copy-windows'], () => {
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

    //electron-packager ./dist 5sing --platform=all --arch=all --out=app --overwrite
    return new Promise((resolve, reject) => {
        packager({
            arch: 'all',
            icon: './dist/assets/logo.icns',
            dir: './dist',
            out: 'app',
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
    }).then(() => {
        return new Promise((resolve, reject) => {
            packager({
                arch: 'all',
                // TODO
                // mac os 10.12 无法安装wine
                // icon: './dist/assets/logo.ico',
                dir: './dist',
                out: 'app',
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
    })

});

gulp.task('build', ['build_package'], () => {
    gutil.log('[build]', '打包成功!');
});

gulp.task('dev', ['compile_dev'], (callback) => {
    gutil.log('[run]', '启动成功!');
    callback();
    exec('NODE_ENV=dev electron ./src/index.js', err => {
        if (err) return gutil.log('[error]', err); // 返回 error
    });
});