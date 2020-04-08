const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        filename: 'app/[name].bundle.js',
        chunkFilename: 'app/[id].chunk.js',
        publicPath: '/'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                loader: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../') + '/.env.development',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true,
        watchOptions: {
            ignored: /node_modules/
        }
    }
};
