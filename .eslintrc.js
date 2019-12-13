module.exports = {
    "root": true,
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true,
        "commonjs": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-redux/recommended",
        "nexus-react-app",
        "./rules/javascript-rules.js",
        "./rules/react-a11y.js",
        "./rules/react.js",
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
        "react-redux/prefer-separate-component-file": 0
    }
};