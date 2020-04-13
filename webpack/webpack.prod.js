const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); 
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const paths = require('./paths');

module.exports = envFile => ({
    mode: 'production',
    devtool: (envFile && envFile.SOURCE_MAP) || false,
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
                sourceMap: (envFile && envFile.SOURCE_MAP) || false,
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
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    plugins: [
        new CleanWebpackPlugin({
            root: paths.appBuild
        }),
        new HtmlWebpackPlugin({
            template: paths.appHtml,
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
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].chunk.css'
        }),
    ],
    output: {
        path: paths.appBuild,
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].[chunkhash].chunk.js',
        publicPath: '/'
    },
});
