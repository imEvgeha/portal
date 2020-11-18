const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const appPaths = require('./paths');

module.exports = envKeys => ({
    entry: [require.resolve('@babel/polyfill'), 'abortcontroller-polyfill', 'whatwg-fetch', appPaths.appIndexJs],
    module: {
        strictExportPresence: true,
        rules: [
            {parser: {system: false}},
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(js|jsx)$/,
                include: appPaths.appSrc,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.(gif|png|jpe?g)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'redux-persist-transform-filter': path.resolve(
                __dirname,
                'src/store-persist-config/packages/redux-persist-transform-filter/index.js'
            ),
            'react-dom': '@hot-loader/react-dom',
            '@vubiquity-nexus/portal-auth': path.resolve(appPaths.appSrc, '../packages/auth'),
        },
    },
    plugins: [
        new webpack.DefinePlugin(envKeys),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {from: 'profile/config.json'},
            {from: 'profile/configQA.json'},
            {from: 'profile/availMapping.json'},
            {from: 'profile/titleMatchingMappings.json'},
            {from: 'profile/titleMatchingRightMappings.json'},
            {from: 'profile/importMap.json'},
        ]),
    ],
});
