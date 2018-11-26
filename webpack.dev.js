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
        chunkFilename: 'app/[id].chunk.js'
    },
    entry: {
        main: './src/index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }, {
                test: /\.scss/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }, {
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
            }
        ],
    },
    plugins: [
        htmlPlugin,
        new CopyWebpackPlugin([
            // relative path is from src
            { from: 'src/favicon.ico' }, // <- your path to favicon
            { from: 'profile/config.json' },
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