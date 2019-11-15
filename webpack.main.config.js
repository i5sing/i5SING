const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    target: 'electron-main',
    entry: './src/main/main.ts',
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
                            transpileOnly: true,
                            configFile: path.resolve(__dirname, 'tsconfig.json')
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new TsconfigPathsPlugin({configFile: path.resolve(__dirname, 'tsconfig.json')}),
    ],
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
            '.json',
            '.jsx',
        ],
    },
    externals: [
        function (context, request, callback) {
            if (request.charAt(0) !== '.' && request !== 'reflect-metadata' && request.indexOf('.ts') === -1) {
                return callback(null, 'commonjs ' + request);
            }
            callback();
        }
    ]
};
