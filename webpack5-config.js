const webpack = require('webpack');
const path = require('path');

module.exports = [
    {
	// https://webpack.js.org/configuration/mode/
	mode: 'production',
	entry: './src/cjs/entry.js',
	output: {
	    path: path.resolve(__dirname, './dist'),
	    filename: 'alloy_finger.browser.js'
	},
	devtool: 'source-map',
	optimization: {
            minimize: false
	}
    },
    {
	// https://webpack.js.org/configuration/mode/
	mode: 'production',
	entry: './src/cjs/entry.js',
	output: {
	    path: path.resolve(__dirname, './dist'),
	    filename: 'alloy_finger.browser.min.js'
	},
	devtool: 'source-map',
	optimization: {
            minimize: true
	}
    }
];
