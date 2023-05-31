const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        app: './js/app.js',
        dashboard: './js/dashboard.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
};
