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
        chunkFilename: 'app/[name].[chunkhash].chunk.js'
    },
    entry: {
        main: './src/index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader', 'eslint-loader']
            },
            {
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
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendorReact: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-redux)[\\/]/,
                    name: 'vendorReact',
                    chunks: 'all',
                    priority: 10
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    priority: 5
                }
            }
        }
    },
    plugins: [
        htmlPlugin,
        new CopyWebpackPlugin([
            // relative path is from src
            { from: 'src/favicon.ico' }, // <- your path to favicon
        ])
    ]
};
