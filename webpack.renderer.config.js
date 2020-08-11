const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            // disable type checker - we will use it in fork plugin
                            transpileOnly: false,
                            configFile: path.resolve(__dirname, 'tsconfig.json')
                        },
                    },
                ],
            },
            {
                test: /\.(css|less)$/,
                exclude: /\.m\.(css|less)$/,
                use: [
                    {
                        loader: require.resolve('style-loader'),
                    },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: require.resolve('less-loader'),
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
            },
            {
                test: /\.m\.(css|less)$/,
                use: [
                    {
                        loader: require.resolve('style-loader'),
                    },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                    {
                        loader: require.resolve('less-loader'),
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 100000000000000,
                },
            },
        ]
    },
    plugins: [
        new TsconfigPathsPlugin({configFile: path.resolve(__dirname, 'tsconfig.json')}),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        })
    ],
    resolve: {
        modules: ['node_modules'],
        extensions: [
            '.tsx',
            '.ts',
            '.js',
            '.json',
            '.jsx',
        ],
    }
};
