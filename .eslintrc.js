module.exports = {
    extends: ['nexus-react-app', 'prettier', 'prettier/react'],
    overrides: {
        files: '*.test.js',
        rules: {
            'no-magic-numbers': 'off',
        },
    },
};
