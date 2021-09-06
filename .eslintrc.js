module.exports = {
    extends: ['nexus-react-app', 'prettier', 'prettier/react'],
    overrides: {
        files: '*.js',
        rules: {
            'no-magic-numbers': 'off',
            'prefer-destructuring': 'off',
            'init-declarations': 'off',
            'react/boolean-prop-naming': 'off',
        },
    },
};
