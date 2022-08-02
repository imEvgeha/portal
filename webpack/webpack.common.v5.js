const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const appPaths = require('./paths');
const ESLintPlugin = require('eslint-webpack-plugin');

const esLintOptions = {
    extensions: [`js`, `jsx`],
    exclude: [`/node_modules/`],
};

module.exports = envKeys => ({
    entry: [appPaths.appIndexJs],
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.svg$/,
                exclude: /node_modules[\\\/]primeicons\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(js|jsx)$/,
                include: appPaths.appSrc,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    // {
                    //     loader: 'eslint-loader',
                    //     options: {eslintPath: 'eslint'},
                    // },
                ],
            },
            {
                test: /\.(gif|png|jpe?g)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        fallback: {
            stream: require.resolve('stream-browserify'),
        },
        alias: {
            'redux-persist-transform-filter': path.resolve(
                __dirname,
                'src/store-persist-config/packages/redux-persist-transform-filter/index.js'
            ),
            'react-dom': '@hot-loader/react-dom',
        },
    },
    plugins: [
        new webpack.DefinePlugin(envKeys),
        new CleanWebpackPlugin(),
        new ESLintPlugin(esLintOptions),
        new CopyWebpackPlugin({
            patterns: [
                'profile/endpoints.json',
                'profile/availMapping.json',
                'profile/titleMatchingMappings.json',
                'profile/titleMatchingRightMappings.json',
            ],
        }),
    ],
});
