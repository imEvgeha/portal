module.exports = {
    "extends": [
        "nexus-react-app",
        "./rules/javascript-rules.js",
        "./rules/react-a11y.js",
        "./rules/react.js",
    ],
    "rules": {
        "no-magic-numbers": ["warn", {ignore: [0, 1, -1]}],
        "func-style": ["warn", "declaration", {"allowArrowFunctions": true}],
    },
    "overrides" : {
        "files": "*.test.js",
        "rules": {
            "no-magic-numbers": "off",
        }
    }
};