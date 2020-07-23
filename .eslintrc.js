module.exports = {
    "extends": [
        "nexus-react-app",
    ],
    "rules": {
        "no-magic-numbers": ["warn", {ignore: [0, 1, -1]}],
        "func-style": ["warn", "declaration", {"allowArrowFunctions": true}],
        "no-duplicate-imports": "warn",
        "import/order": ["warn", {
            "groups": ["builtin", "external", "internal", "parent", "sibling"],
            "pathGroups": [
                {
                    "pattern": "react",
                    "group": "external",
                    "position": "before",
                },
                {
                    "pattern": "prop-types",
                    "group": "external",
                    "position": "before",
                },
                {
                    "pattern": "./constants",
                    "group": "sibling",
                    "position": "after",
                },
                {
                    "pattern": "../constants",
                    "group": "sibling",
                    "position": "after",
                }
            ],
            "pathGroupsExcludedImportTypes": ["react"],
            "newlines-between": "never",
            "alphabetize": {
                "order": "asc",
                "caseInsensitive": false,
            }
        }],
    },
    "overrides" : {
        "files": "*.test.js",
        "rules": {
            "no-magic-numbers": "off",
        }
    }
};
