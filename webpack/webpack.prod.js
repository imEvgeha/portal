const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('./paths');

const isCssModule = module => module.type === 'css/mini-extract';
const FRAMEWORK_BUNDLES = ['react', 'react-dom', 'scheduler', 'prop-types'];

module.exports = envFile => ({
    mode: 'production',
    devtool: (envFile && envFile.SOURCE_MAP) || false,
    bail: true,
    module: {
        rules: [
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'initial',
            cacheGroups: {
                default: false,
                vendors: false,
                framework: {
                    chunks: 'all',
                    name: 'framework',
                    test: new RegExp(
                        `(?<!node_modules.*)[\\\\/]node_modules[\\\\/](${FRAMEWORK_BUNDLES.join('|')})[\\\\/]`
                    ),
                    priority: 40,
                    enforce: true,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    enforce: true,
                },
                styles: {
                    test(module) {
                        return isCssModule(module);
                    },
                    name: 'styles',
                    priority: 40,
                    enforce: true,
                },
            },
        },
        runtimeChunk: {
            name: 'webpack-runtime',
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: false,
                        comparisons: false,
                        drop_console: true,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        comments: false,
                        ascii_only: true,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    plugins: [
        new CleanWebpackPlugin({
            root: paths.appBuild,
        }),
        new HtmlWebpackPlugin({
            template: paths.appHtml,
            inject: true,
            favicon: 'public/favicon.ico',
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
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].chunk.css',
            // ignoreOrder: true,
        }),
    ],
    output: {
        path: paths.appBuild,
        filename: 'js/[name].[hash].bundle.js',
        chunkFilename: 'js/[name].[chunkhash].chunk.js',
        publicPath: '/',
    },
    // tell Webpack to provide empty mocks for imported Node modules not use
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
});
