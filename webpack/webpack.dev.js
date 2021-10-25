const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = envFile => ({
    mode: 'development',
    devtool: (envFile && envFile.SOURCE_MAP) || 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.(scss|css)/,
                loader: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    require.resolve('sass-loader'),
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: paths.appHtml,
            inject: true,
            favicon: 'public/favicon.ico',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
        path: paths.appBuild,
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[chunkhash].chunk.js',
        publicPath: '/',
        pathinfo: false,
        hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
        hotUpdateMainFilename: 'hot/[hash].hot-update.json',
    },
    devServer: {
        port: (envFile && envFile.PORT) || 3000,
        historyApiFallback: true,
        watchOptions: {
            ignored: /node_modules/,
        },
        clientLogLevel: 'info',
        hot: true,
        inline: true,
        open: true,
        stats: (envFile && envFile['BUILD_STATS']) || 'normal',
    },
    performance: {
        hints: false,
    },
    optimization: {
        namedModules: true,
    },
});
