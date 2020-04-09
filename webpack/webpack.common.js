const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        // require.resolve('react-hot-loader/patch'),
        require.resolve('@babel/polyfill'),
        './src/index.js',
    ],
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, '../', 'src'),
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                use: 'react-hot-loader/webpack',
                include: /node_modules/
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
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json'],
        alias: {
            'redux-persist-transform-filter': path.resolve(
                __dirname,
                'src/store-persist-config/packages/redux-persist-transform-filter/index.js'
            ),
            'react-dom': '@hot-loader/react-dom',
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            // relative path is from src
            { from: 'src/assets/favicon.ico' }, // <- your path to favicon
            { from: 'profile/config.json' },
            { from: 'profile/configQA.json' },
            { from: 'profile/availMapping.json' },
            { from: 'profile/titleMatchingMappings.json' },
            { from: 'profile/titleMatchingRightMappings.json'},
        ]),
    ],
    // devServer: {
    //     contentBase: './dist',
    // },
};
