module.exports = {
    extends: ['nexus-react-app', 'prettier'],
    ignorePatterns: ['dist/*', 'node_modules/*'],
    parser: '@babel/eslint-parser',
    overrides: [
        {
            files: '*.js',
            rules: {
                'no-magic-numbers': 'off',
                'prefer-destructuring': 'off',
                'init-declarations': 'off',
                'react/boolean-prop-naming': 'off',
            },
        },
    ],
};
