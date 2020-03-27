const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html'
});

module.exports = {
    output: {
        path: __dirname + '/dist',
        filename: 'app/[name].bundle.js',
        chunkFilename: 'app/[id].chunk.js',
        publicPath: '/'
    },
    entry: {
        main: ['@babel/polyfill', './src/index.js']
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            'redux-persist-transform-filter': path.resolve(
                __dirname,
                'src/store-persist-config/packages/redux-persist-transform-filter/index.js'
            ),
        }
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }, {
                test: /\.(scss|css)/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }, {
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
    plugins: [
        htmlPlugin,
        new CopyWebpackPlugin([
            // relative path is from src
            { from: 'src/assets/favicon.ico' }, // <- your path to favicon
            { from: 'profile/config.json' },
            { from: 'profile/configQA.json' },
            { from: 'profile/availMapping.json' }
        ])
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true,
        watchOptions: {
            ignored: /node_modules/
        }
    }
};
