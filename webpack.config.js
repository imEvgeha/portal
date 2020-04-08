const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack/webpack.common.js');

module.exports = ({env}) => {
    const envConfig = require(`./webpack/webpack.${env}.js`);
    return webpackMerge(commonConfig, envConfig);
};
