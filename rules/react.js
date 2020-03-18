module.exports = {
    plugins: [
        'react',
        'react-hooks',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.json'],
            },
        },
        'react': {
            pragma: 'React',
            version: '16.10.2',
        },
        'propWrapperFunctions': [
            'forbidExtraProps', // https://www.npmjs.com/package/airbnb-prop-types
            'exact', // https://www.npmjs.com/package/prop-types-exact
            'Object.freeze', // https://tc39.github.io/ecma262/#sec-object.freeze
        ],
    },
    rules: {
        // Enforces consistent naming for boolean props
        'react/boolean-prop-naming': ['off', {rule: '^(is|has|are)[A-Z]([A-Za-z0-9]?)+'}],

        // Forbid "button" element without an explicit "type" attribute
        'react/button-has-type': 'off',

        // Rule enforces consistent usage of destructuring assignment in component
        'react/destructuring-assignment': 'off',

        // Prevent missing displayName in a React component definition
        'react/display-name': 'off',

        // Forbid certain props on Components
        'react/forbid-component-props': 'off',

        // Forbid certain props on DOM Nodes
        'react/forbid-dom-props': 'off',

        // Forbid certain elements
        'react/forbid-elements': 'off',

        // Forbid certain propTypes
        'react/forbid-prop-types': 'off',

        // Forbid foreign propTypes
        'react/forbid-foreign-prop-types': 'off',

        // Prevent using this.state inside this.setState
        'react/no-access-state-in-setstate': 'off',

        // Prevent using Array index in key props
        'react/no-array-index-key': 'off',

        // Prevent usage of dangerous JSX properties
        'react/no-danger': 'off',

        // Prevent usage of setState in componentDidMount
        'react/no-did-mount-set-state': 'off',

        // Prevent usage of setState in componentDidUpdate
        'react/no-did-update-set-state': 'off',

        // Prevent usage of findDOMNode
        'react/no-find-dom-node': 'off',

        // Prevent usage of setState
        // When we convert to hooks
        'react/no-set-state': 'off',

        // Enforce stateless React Components to be written as a pure function
        'react/prefer-stateless-function': ['off', {ignorePureComponents: true}],

        // Prevent missing props validation in a React component definition
        'react/prop-types': [
            'off',
            {
                ignore: ['children'],
                customValidators: [],
                skipUndeclared: false,
            },
        ],

        // Enforce a defaultProps definition for every prop that is not a required prop
        'react/require-default-props': ['off', {forbidDefaultForRequired: true}],

        // Enforce React components to have a shouldComponentUpdate method
        'react/require-optimization': 'off',

        // Enforce ES5 or ES6 class for returning value in render function
        'react/require-render-return': 'off',

        // Enforce component methods order
        'react/sort-comp': 'off',

        // Enforce propTypes declarations alphabetical sorting
        'react/sort-prop-types': 'off',

        // JSX-specific rules

        // Enforce boolean attributes notation in JSX
        'react/jsx-boolean-value': 'off',

        // Enforce event handler naming conventions in JSX
        'react/jsx-handler-names': 'off',

        // Validate JSX maximum depth
        'react/jsx-max-depth': 'off',

        // Limit maximum of props on a single line in JSX
        'react/jsx-props-no-spreading': ['off', {maximum: 1, when: 'multiline'}],

        // Prevent usage of unwrapped JSX strings
        'react/jsx-no-literals': 'off',

        // Limit to one expression per line in JSX
        'react/jsx-one-expression-per-line': 'off',

        // Enforce default props alphabetical sorting
        'react/jsx-sort-default-props': 'off',

        // Enforce props alphabetical sorting'
        'react/jsx-sort-props': 'off',

        // Validate spacing before closing bracket in JSX
        // off in favor of jsx-tag-spacing
        'react/jsx-space-before-closing': 'off',

        // Checks effect dependencies
        'react-hooks/exhaustive-deps': 'off',
    },
};