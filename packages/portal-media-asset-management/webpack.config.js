const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const singleSpaDefaults = require('webpack-config-single-spa-react');
const webpackMerge = require('webpack-merge');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp('src');

module.exports = webpackConfigEnv => {
    const defaultConfig = singleSpaDefaults({
        orgName: 'portal-mf',
        projectName: 'media-asset-management',
        webpackConfigEnv,
    });

    const rxjsExternals = {
        externals: [/^rxjs\/?.*$/],
    };

    return webpackMerge.smart(defaultConfig, rxjsExternals, {
        module: {
            rules: [
                {parser: {system: false}},
                {
                    test: /\.(scss|css)/,
                    loader: [
                        require.resolve('style-loader'),
                        require.resolve('css-loader'),
                        require.resolve('sass-loader'),
                    ],
                },
                {
                    test: /\.(js|jsx)$/,
                    include: appSrc,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
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
            ],
        },
        devtool: 'cheap-eval-source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        optimization: {
            namedModules: true,
        },
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            },
        },
        output: {
            libraryTarget: 'system',
        },
        plugins: [new webpack.NamedModulesPlugin()],
    });
};
