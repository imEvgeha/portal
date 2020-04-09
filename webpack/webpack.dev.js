const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.(scss|css)/,
                loader: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    require.resolve('sass-loader'),
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            inject: true,
        }),
        new Dotenv({
            path: path.resolve(__dirname, '../') + '/.env.development',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js',
        publicPath: '/',
        pathinfo: false,

    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
        watchOptions: {
            ignored: /node_modules/
        }
    },
    optimization: {
        namedModules: true,
    },
    performance: {
        hints: false, 
    },
};
