const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
	new HtmlWebpackPlugin({ template: 'src/index.html' }),
	new webpack.ProvidePlugin({
		THREE: 'three',
	}),
];
if (process.env.NPM_BUILD === 'production') {
	plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		})
	);
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
		})
	);
}

module.exports = {
	entry: './src/main.js',
	devtool: 'cheap-module-source-map',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			// js
			{ test: /\.js$/, use: ['babel-loader'], include: [path.resolve(__dirname, 'src')] },
			// style
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
			// fonts
			{ test: /\.otf$/, use: ['file-loader'] },
			// 3D models
			{ test: /\.(obj|mtl)$/, use: ['file-loader'] },
			// images
			{ test: /\.(jpg|jpeg|png|svg)$/, use: ['file-loader'] },
			// shaders
			{ test: /\.glsl$/, use: ['webpack-glsl-loader'] },
		],
	},
	plugins,
	devServer: {
		host: '0.0.0.0',
		contentBase: path.join(__dirname, 'dist'),
		historyApiFallback: true,
		open: true,
	},
};
