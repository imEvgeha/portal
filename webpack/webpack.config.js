const fs = require('fs'); // to check if the file exists
const path = require('path'); // to get the current path
const dotenv = require('dotenv');
const moment = require('moment');
// const webpackMerge = require('webpack-merge');
const {merge} = require('webpack-merge');
const packageJSON = require('../package');
const commonConfig = require('./webpack.common.js');

const getAddons = addonsArgs => {
    const addons = Array.isArray(addonsArgs) ? addonsArgs : [addonsArgs];
    return addons.filter(Boolean).map(name => require(`./addons/webpack.${name}.js`));
};

const getEnvFileSuffix = ({env}) => {
    switch (env) {
        case 'dev':
            return 'development';
        case 'prod':
            return 'production';
        default:
            return '';
    }
};

module.exports = ({env, addon}) => {
    const currentPath = path.join(__dirname, '..');
    // Create the fallback path ()
    const basePath = currentPath + '/.env';
    // We're concatenating the environment name to our filename to specify the correct env file!
    const envPath = basePath + '.' + getEnvFileSuffix(env);
    // Check if the file exists, otherwise fall back to the production .env
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    // Set the path parameter in the dotenv config
    let envFile = dotenv.config({path: finalPath}).parsed || {};
    if (Object.keys(envFile)) {
        envFile = {
            ...envFile,
            VERSION: packageJSON.version,
            BUILD: moment().format('YYYYMMDD.HHmmss'),
        };
    }
    // reduce it to a nice object, the same as before (but with the variables from the file)
    const envKeys = Object.keys(envFile).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(envFile[next]);
        return prev;
    }, {});
    const envConfig = require(`./webpack.${env}.js`);

    return merge(commonConfig(envKeys, env), envConfig(envFile), ...getAddons(addon));
};
