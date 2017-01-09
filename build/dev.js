/**
 * Created by feng on 2017/1/9.
 */
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const exec = require('child_process').exec;

let start = false;
webpack(webpackConfig, (err, stats) => {
    if (err) {
        throw new gutil.PluginError('webpack', err);
    }

    console.log('[webpack]', stats.toString({modules: false, colors: true}));
    if (!start) {
        start = true;
        console.log('[run]', '启动成功!');
        exec('cross-env NODE_ENV=dev electron ./app/index.js', err => {
            if (err) return gutil.log('[error]', err); // 返回 error
        });
    } else {
        console.log('[recompile]', '编译成功');
    }
});