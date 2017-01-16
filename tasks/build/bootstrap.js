/**
 * Created by feng on 2017/1/14.
 */
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

function bootstrap() {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            throw err;
        }

        console.log('[webpack]', stats.toString({modules: false, colors: true}));
        console.log('[compile]', 'react 编译成功');
    });
}

bootstrap();