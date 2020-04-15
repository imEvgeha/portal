'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;
const envPublicUrl = process.env.PUBLIC_URL;

module.exports = {
    appBuild: resolveApp('dist'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp('src/index.js'),
    appServerJs: resolveApp('src/server.js'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    testsSetup: resolveApp('src/setupTests.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
};
