/**
 * Created by zhaofeng on 7/18/16.
 */
var gulp = require('gulp');
var clean = require('gulp-clean');
var install = require("gulp-install");
var packager = require('electron-packager');
var webpack = require('webpack');
var gutil = require('gulp-util');

var webpackConfig = require('./build/webpack.config.proc.js');

gulp.task('clean', function () {
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

gulp.task('copy', ['copy-modules'], function (callback) {
    callback();
});

gulp.task('install', ['copy'], function () {
    return gulp.src('./dist/package.json')
        .pipe(gulp.dest('./dist'))
        .pipe(install({production: true}));
});

gulp.task('compile', ['copy'], function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({modules: false, colors: true}));
        callback();
    });
});

gulp.task('build_package', ['install', 'compile'], function (callback) {

    //electron-packager ./dist elsa --platform=all --arch=all --out=app --overwrite
    packager({
        arch: 'all',
        // icon: icon,
        dir: './dist',
        out: 'app',
        name: 'elsa',
        version: '1.2.6',
        platform: 'all',
        overwrite: true
    }, function (err, appPath) {
        if (appPath) {
            var distPath = appPath[0];
            callback && callback();
        }
    });
});

gulp.task('build', ['build_package'], function () {
    gutil.log('[build]', '打包成功!');
});