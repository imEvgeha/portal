const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        filename: 'app/[name].bundle.js',
        chunkFilename: 'app/[name].[chunkhash].chunk.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
        ]
    },
    devtool: 'eval-source-map',
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
        new Dotenv({
            path: path.resolve(__dirname, '../') + '/.env.production',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }),
    ],
};
