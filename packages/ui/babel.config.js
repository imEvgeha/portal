/* eslint-disable max-len, import/no-commonjs, import/unambiguous */
module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        'react-hot-loader/babel',
        '@babel/plugin-syntax-dynamic-import',
    ],
};
