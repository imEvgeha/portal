const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const appPaths = require('./paths');
const ESLintPlugin = require('eslint-webpack-plugin');

const esLintOptions = {
    files: ['src/**/*.jsx', 'src/**/*.js'],
    extensions: ['js', 'jsx'],
    exclude: ['**/node_modules/'],
    eslintPath: require.resolve('eslint'),
    useEslintrc: true,
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
                use: ['babel-loader'],
            },
            {
                test: /\.(gif|png|jpe?g)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff',
            },
            {test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000'},
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
        },
    },
    plugins: [
        new webpack.DefinePlugin(envKeys),
        new CleanWebpackPlugin(),
        new ESLintPlugin(esLintOptions),
        new CopyWebpackPlugin([
            {from: 'profile/config.json'},
            {from: 'profile/configQA.json'},
            {from: 'profile/availMapping.json'},
            {from: 'profile/titleMatchingMappings.json'},
            {from: 'profile/titleMatchingRightMappings.json'},
        ]),
    ],
});
