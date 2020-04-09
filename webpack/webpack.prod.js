const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); 
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: shouldUseSourceMap ? 'source-map' : false,
    bail: true,
    module: {
        rules: [
            {
            test: /\.(scss|css)/,
            loader: [
                MiniCssExtractPlugin.loader,
                require.resolve('css-loader'),
                require.resolve('sass-loader'),
            ]
        },
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendorReact: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-redux)[\\/]/,
                    name: 'vendorReact',
                    chunks: 'all',
                    priority: 10
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    priority: 5
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                sourceMap: shouldUseSourceMap,
                terserOptions: {
                    compress: {
                        warnings: false,
                        comparisons: false,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        comments: false,
                        ascii_only:true,
                    }
                },
            }),
            new OptimizeCSSAssetsPlugin(), 
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.join(__dirname, '../dist')
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        }),
        new Dotenv({
            path: path.resolve(__dirname, '../') + '/.env.production',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].chunk.css'
        }),
    ],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].[chunkhash].chunk.js',
        publicPath: '/'
    },
};
