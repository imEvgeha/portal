const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = envFile => ({
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.(scss|css)/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
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
        port: (envFile && envFile.PORT) || 8001,
        historyApiFallback: true,
        static: {
            watch: {
                ignored: /node_modules/,
            },
        },

        client: {
            logging: 'info',
            overlay: {
                warnings: true,
                errors: true,
            },
        },
        hot: 'only',
        open: true,
        devMiddleware: {
            stats: (envFile && envFile['BUILD_STATS']) || 'normal',
        },
    },
    watchOptions: {
        ignored: ['files/**/*.test.js', 'node_modules'],
    },
    performance: {
        hints: false,
    },
    optimization: {
        namedModules: true,
    },
});
