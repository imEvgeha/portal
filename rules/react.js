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

        // Prevent extraneous defaultProps on components
        'react/default-props-match-prop-types': ['off', {allowRequiredDefaults: false}],

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

        // Prevent passing children as props
        'react/no-children-prop': 'off',

        // Prevent usage of dangerous JSX properties
        'react/no-danger': 'off',

        // Prevent problem with children and props.dangerouslySetInnerHTML
        'react/no-danger-with-children': 'off',

        // Prevent usage of deprecated methods, including component lifecycle methods
        'react/no-deprecated': 'off',

        // Prevent usage of setState in componentDidMount
        'react/no-did-mount-set-state': 'off',

        // Prevent usage of setState in componentDidUpdate
        'react/no-did-update-set-state': 'off',

        // Prevent direct mutation of this.state
        'react/no-direct-mutation-state': 'off',

        // Prevent usage of findDOMNode
        'react/no-find-dom-node': 'off',

        // Prevent usage of isMounted
        'react/no-is-mounted': 'off',

        // Prevent multiple component definition per file
        'react/no-multi-comp': ['off', {ignoreStateless: true}],

        // Prevent usage of shouldComponentUpdate when extending React.PureComponent
        'react/no-redundant-should-component-update': 'off',

        // Prevent usage of the return value of React.render
        'react/no-render-return-value': 'off',

        // Prevent usage of setState
        // When we convert to hooks
        'react/no-set-state': 'off',

        // Prevent common casing typos
        'react/no-typos': 'off',

        // Prevent using string references in ref attribute
        'react/no-string-refs': 'off',

        // Prevent using this in stateless functional components
        'react/no-this-in-sfc': 'off',

        // Prevent invalid characters from appearing in markup
        'react/no-unescaped-entities': 'off',

        // Prevent usage of unknown DOM property
        'react/no-unknown-property': 'off',

        // Prevent definitions of unused prop types
        'react/no-unused-prop-types': 'off',

        // Prevent definitions of unused state properties
        'react/no-unused-state': 'off',

        // Prevent usage of setState in componentWillUpdate
        'react/no-will-update-set-state': 'off',

        // Enforce ES5 or ES6 class for React Components
        'react/prefer-es6-class': ['off', 'always'],

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

        // Prevent missing React when using JSX
        'react/react-in-jsx-scope': 'off',

        // Enforce a defaultProps definition for every prop that is not a required prop
        'react/require-default-props': ['off', {forbidDefaultForRequired: true}],

        // Enforce React components to have a shouldComponentUpdate method
        'react/require-optimization': 'off',

        // Enforce ES5 or ES6 class for returning value in render function
        'react/require-render-return': 'off',

        // Prevent extra closing tags for components without children
        'react/self-closing-comp': 'off',

        // Enforce component methods order
        'react/sort-comp': 'off',

        // Enforce propTypes declarations alphabetical sorting
        'react/sort-prop-types': 'off',

        // Enforce style prop value being an object
        'react/style-prop-object': 'off',

        // Prevent void DOM elements (e.g. <img />, <br />) from receiving children
        'react/void-dom-elements-no-children': 'off',

        // JSX-specific rules

        // Enforce boolean attributes notation in JSX
        'react/jsx-boolean-value': 'off',

        // Restrict file extensions that may contain JSX
        'react/jsx-filename-extension': ['off', {extensions: ['.js']}],


        // Enforce event handler naming conventions in JSX
        'react/jsx-handler-names': 'off',


        // Validate JSX has key prop when in array or iterator
        'react/jsx-key': 'off',

        // Validate JSX maximum depth
        'react/jsx-max-depth': 'off',

        // Limit maximum of props on a single line in JSX
        'react/jsx-props-no-spreading': ['off', {maximum: 1, when: 'multiline'}],

        // Prevent comments from being inserted as text nodes
        'react/jsx-no-comment-textnodes': 'off',

        // Prevent duplicate props in JSX
        'react/jsx-no-duplicate-props': ['off', {ignoreCase: true}],

        // Prevent usage of unwrapped JSX strings
        'react/jsx-no-literals': 'off',

        // Disallow undeclared variables in JSX
        'react/jsx-no-undef': 'off',

        // Limit to one expression per line in JSX
        'react/jsx-one-expression-per-line': 'off',

        // Enforce PascalCase for user-defined JSX components
        'react/jsx-pascal-case': ['off', {allowAllCaps: true, ignore: []}],

        // Enforce default props alphabetical sorting
        'react/jsx-sort-default-props': 'off',

        // Enforce props alphabetical sorting'
        'react/jsx-sort-props': 'off',

        // Validate spacing before closing bracket in JSX
        // off in favor of jsx-tag-spacing
        'react/jsx-space-before-closing': 'off',

        // Prevent React to be incorrectly marked as unused
        'react/jsx-uses-react': 'off',

        // Prevent variables used in JSX to be incorrectly marked as unused
        'react/jsx-uses-vars': 'off',

        // Checks rules of Hooks
        'react-hooks/rules-of-hooks': 'off',

        // Checks effect dependencies
        'react-hooks/exhaustive-deps': 'off',
    },
};