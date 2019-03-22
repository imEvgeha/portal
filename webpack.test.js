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
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader', 'eslint-loader']
            }, {
                test: /\.(scss|css)/,
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
    }
};