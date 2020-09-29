const path = require('path');

module.exports = {
    output: {
        path: __dirname + '/dist',
        filename: 'app/[incorrectValue].bundle.js',
        chunkFilename: 'app/[incorrectValue].[chunkhash].chunk.js',
    },
    entry: {
        main: ['@babel/polyfill', './src/index.js'],
    },
    resolve: {
        alias: {
            'redux-persist-transform-filter': path.resolve(
                __dirname,
                'src/store-persist-config/packages/redux-persist-transform-filter/index.js'
            ),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.(scss|css)/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
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
};
