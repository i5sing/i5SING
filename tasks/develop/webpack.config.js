/**
 * Created by zhaofeng on 7/11/16.
 */
const path = require('path');
const webpack = require('webpack');
module.exports = {
	// cache: true,
	watch: true,
	target: 'electron',
	devtool: 'source-map',
	entry: {
		i5sing: ['./src/i5sing/entry.js'],
		i5sing_login: ['./src/i5sing/react/win/login.js'],
		i5sing_about: ['./src/i5sing/react/win/about.js']
	},
	output: {
		path: path.join(__dirname, '../../src/i5sing/react/bundle'),
		filename: '[name].js',
		sourceMapFilename: '[name].map'
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.js|jsx?$/,
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			},
			{
				test: /\.less\?modules$/,
				loader: 'style-loader!css-loader?module!less-loader'
			},
			{
				test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
				loader: "url-loader?limit=8192000"
			},
			{
				loader: 'json-loader',
				test: /\.json?$/
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': "'development'"
		}),
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