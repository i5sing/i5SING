/**
 * Created by zhaofeng on 7/11/16.
 */
var path = require('path');
var webpack = require('webpack');
module.exports = {
    cache: true,
    target: 'electron',
    entry: {
        main: './src/entry.js'
    },
    output: {
        path: path.join(__dirname, '../dist/static'),
        filename: '[name].js',
        chunkFilename: '[chunkhash].js',
        sourceMapFilename: '[name].map'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, '../src')
                ],

                // Only run `.js` and `.jsx` files through Babel
                test: /\.js|\.jsx?$/,

                // Options to configure babel with
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/, // Only .css files
                loader: 'style!css' // Run both loaders
            },
            // LESS
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: "url?limit=8192000"
            },
            {
                loader: 'json-loader',
                test: /\.json?$/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'production'"
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    "externals": {
        "sqlite3": "require('sqlite3')",
        "5sing-sdk": "require('5sing-sdk')"
    }
};