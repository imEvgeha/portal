module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-redux/recommended",
        "nexus-react-app",
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-redux"
    ],
    "rules": {
        "template-curly-spacing": "off",
        // "indent": [
        //     "error",
        //     4
        // ],
        "indent": "off",
        // "linebreak-style": [
        //     "error",
        //     "unix"
        // ],
        "no-var": "error",
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": ["error", { allow: ["warn", "error"]}],
        "react/no-find-dom-node": 0,
        "react/display-name": [0, { "ignoreTranspilerName": true }],
        "react-redux/prefer-separate-component-file": 0
    }
};