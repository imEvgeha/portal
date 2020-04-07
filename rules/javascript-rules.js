// We use eslint-loader so even warnings are very visible.
// This is why we mostly use "WARNING" level for potential errors,
// and avoid "ERROR" level.

// The rules below are listed in the order they appear on the eslint
// rules page. All rules are listed to make it easier to keep in sync
// as new ESLint rules are added.
// https://github.com/benmosher/eslint-plugin-import

const restrictedGlobals = require('../restrictedBrowserGlobals');

module.exports = {
    plugins: [
        'import',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.mjs', '.js', '.json'],
            },
        },
        'import/extensions': ['.js', '.mjs', '.jsx'],
        'import/core-modules': [],
        'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
    },
    rules: {
        // enforce getter and setter pairs in objects
        'accessor-pairs': 'off',

        // enforces return statements in callbacks of array's methods
        'array-callback-return': ['off', {allowImplicit: true}],

        // enforce the use of variables within the scope they are defined
        'block-scoped-var': 'off',

        // enforce that class methods utilize this
        'class-methods-use-this': 'off',

        // enforce a maximum cyclomatic complexity allowed in a program
        'complexity': ['off', 11],

        // require return statements to either always or never specify values
        'consistent-return': 'off',

        // enforce consistent brace style for all control statements
        'curly': 'off',

        // require default cases in switch statements
        'default-case': 'off',

        // enforce consistent newlines before and after dots
        'dot-location': ['off', 'property'],

        // enforce dot notation whenever possible
        'dot-notation': 'off',

        // require the use of === and !==
        'eqeqeq': ['off', 'always', {'null': 'ignore'}],

        // require for-in loops to include an if statement
        'guard-for-in': 'off',

        // disallow the use of alert, confirm, and prompt
        'no-alert': 'off',

        // disallow the use of arguments.caller or arguments.callee
        'no-caller': 'off',

        // disallow lexical declarations in case clauses
        'no-case-declarations': 'off',

        // disallow division operators explicitly at the beginning of regular expressions
        'no-div-regex': 'off',

        // disallow else blocks after return statements in if statements
        'no-else-return': 'off',

        // disallow empty functions
        'no-empty-function': 'off',

        // disallow empty destructuring patterns
        'no-empty-pattern': 'off',

        // disallow null comparisons without type-checking operators
        'no-eq-null': 'off',

        // disallow use of eval()
        'no-eval': 'off',

        // disallow adding to native types
        'no-extend-native': 'off',

        // disallow unnecessary calls to .bind()
        'no-extra-bind': 'off',

        // disallow unnecessary labels
        'no-extra-label': 'off',

        // disallow fallthrough of case statements
        'no-fallthrough': 'off',

        // disallow leading or trailing decimal points in numeric literals
        'no-floating-decimal': 'off',

        // disallow assignments to native objects or read-only global variables
        'no-global-assign': ['off', {exceptions: []}],

        // disallow shorthand type conversions
        'no-implicit-coercion': 'off',

        // disallow variable and function declarations in the global scope
        'no-implicit-globals': 'off',

        // disallow use of eval()-like methods
        'no-implied-eval': 'off',

        // disallow this keywords outside of classes or class-like objects
        'no-invalid-this': 'off',

        // disallow usage of __iterator__ property
        'no-iterator': 'off',

        // disallow labeled statements
        'no-labels': ['off', {allowLoop: true, allowSwitch: false}],

        // disallow unnecessary nested blocks
        'no-lone-blocks': 'off',

        // disallow function declarations and expressions inside loop statements
        'no-loop-func': 'off',

        // disallow magic numbers
        'no-magic-numbers': 'off',

        // disallow multiple spaces
        'no-multi-spaces': ['off', {ignoreEOLComments: false}],

        // disallow multiline strings
        'no-multi-str': 'off',

        // disallow new operators outside of assignments or comparisons
        'no-new': 'off',

        // disallow new operators with the Function object
        'no-new-func': 'off',

        // disallow new operators with the String, Number, and Boolean objects
        'no-new-wrappers': 'off',

        // disallow octal literals
        'no-octal': 'off',

        // disallow octal escape sequences in string literals
        'no-octal-escape': 'off',

        // disallow reassigning function parameters
        'no-param-reassign': 'off',

        // disallow the use of the __proto__ property
        'no-proto': 'off',

        // disallow variable redeclaration
        'no-redeclare': 'off',

        // disallow certain properties on certain objects
        'no-restricted-properties': [
            'off',
            {
                object: 'require',
                property: 'ensure',
                message: 'Please use import() instead. More info: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting',
            },
            {
                object: 'System',
                property: 'import',
                message: 'Please use import() instead. More info: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting',
            },
        ],

        // disallow assignment operators in return statements
        'no-return-assign': 'off',

        // disallow unnecessary return await
        'no-return-await': 'off',

        // disallow javascript: urls
        'no-script-url': 'off',

        // disallow assignments where both sides are exactly the same
        'no-self-assign': 'off',

        // disallow comparisons where both sides are exactly the same
        'no-self-compare': 'off',

        // disallow comma operators
        'no-sequences': 'off',

        // disallow throwing literals as exceptions
        'no-throw-literal': 'off',

        // disallow unmodified loop conditions
        'no-unmodified-loop-condition': 'off',

        // disallow unused expressions
        'no-unused-expressions': [
            'off',
            {
                allowShortCircuit: true,
                allowTernary: true,
                allowTaggedTemplates: true,
            },
        ],

        // disallow unused labels
        'no-unused-labels': 'off',

        // disallow unnecessary .call() and .apply()
        'no-useless-call': 'off',

        // disallow unnecessary concatenation of literals or template literals
        'no-useless-concat': 'off',

        // disallow unnecessary escape characters
        'no-useless-escape': 'off',

        // disallow redundant return statements
        'no-useless-return': 'off',

        // disallow void operators
        'no-void': 'off',

        // disallow specified warning terms in comments
        'no-warning-comments': [0, {terms: ['todo', 'fixme', 'xxx'], location: 'start'}],

        // disallow with statements
        'no-with': 'off',

        // require using Error objects as Promise rejection reasons
        'prefer-promise-reject-errors': ['off', {allowEmptyReject: true}],

        // require use of the second argument for parseInt()
        'radix': 'off',

        // disallow async functions which have no await expression
        'require-await': 'off',

        // require var declarations be placed at the top of their containing scope
        'vars-on-top': 'off',

        // require parentheses around immediate function invocations
        'wrap-iife': ['off', 'outside', {functionPrototypeMethods: false}],

        // require or disallow “Yoda” conditions
        'yoda': 'off',

        // ES6

        // require braces around arrow function bodies
        'arrow-body-style': 'off',

        // require parentheses around arrow function arguments
        'arrow-parens': ['off', 'as-needed'],

        // enforce consistent spacing before and after the arrow in arrow functions
        'arrow-spacing': 'off',

        // require super() calls in constructors
        'constructor-super': 'off',

        // enforce consistent spacing around * operators in generator functions
        'generator-star-spacing': ['off', {before: false, after: true}],

        // disallow reassigning class members
        'no-class-assign': 'off',

        // disallow arrow functions where they could be confused with comparisons
        'no-confusing-arrow': ['off', {allowParens: true}],

        // disallow reassigning const variables
        'no-const-assign': 'off',

        // disallow duplicate class members
        'no-dupe-class-members': 'off',

        // disallow duplicate module imports
        // replaced by https://github.com/benmosher/eslint-plugin-import
        'no-duplicate-imports': 'off',

        // disallow new operators with the Symbol object
        'no-new-symbol': 'off',

        // disallow specified modules when loaded by import
        'no-restricted-imports': 'off',

        // disallow this/super before calling super() in constructors
        'no-this-before-super': 'off',

        // disallow unnecessary computed property keys in object literals
        'no-useless-computed-key': 'off',

        // disallow unnecessary constructors
        'no-useless-constructor': 'off',

        // disallow renaming import, export, and destructured assignments to the same name
        'no-useless-rename': [
            'off',
            {
                ignoreDestructuring: false,
                ignoreImport: false,
                ignoreExport: false,
            },
        ],

        // require let or const instead of var
        'no-var': 'error',

        // require or disallow method and property shorthand syntax for object literals
        'object-shorthand': 'off',

        // require using arrow functions for callbacks
        'prefer-arrow-callback': [
            'off',
            {
                allowNamedFunctions: false,
                allowUnboundThis: true,
            },
        ],

        // require const declarations for variables that are never reassigned after declared
        'prefer-const': [
            'off',
            {
                destructuring: 'all',
                ignoreReadBeforeAssign: true,
            },
        ],

        // require destructuring from arrays and/or objects
        'prefer-destructuring': 'off',

        // disallow parseInt() and Number.parseInt() in favor of binary, octal, and hexadecimal literals
        'prefer-numeric-literals': 'off',

        // require rest parameters instead of arguments
        'prefer-rest-params': 'off',

        // require spread operators instead of .apply()
        'prefer-spread': 'off',

        // suggest using template literals instead of string concatenation
        'prefer-template': 'off',

        // require generator functions to contain yield
        'require-yield': 'off',

        // enforce spacing between rest and spread operators and their expressions
        'rest-spread-spacing': ['off', 'never'],

        // enforce sorted import declarations within modules
        'sort-imports': 'off',

        // require symbol descriptions
        'symbol-description': 'off',

        // require or disallow spacing around embedded expressions of template strings
        'template-curly-spacing': ['off', 'never'],

        // require or disallow spacing around the * in yield* expressions
        'yield-star-spacing': ['off', 'after'],


        // IMPORTS

        // Static analysis:

        // Ensure imports point to a file/module that can be resolved
        'import/no-unresolved': 'off',

        // Ensure named imports correspond to a named export in the remote file
        'import/named': 'off',

        // Ensure a default export is present, given a default import
        'import/default': 'off',

        // Ensure imported namespaces contain dereferenced properties as they are dereferenced
        'import/namespace': 'off',

        // Restrict which files can be imported in a given folder
        'import/no-restricted-paths': 'off',

        // Forbid import of modules using absolute paths
        'import/no-absolute-path': 'off',

        // Forbid require() calls with expressions
        'import/no-dynamic-require': 'off',

        // Prevent importing the submodules of other modules
        'import/no-internal-modules': 'off',

        // Forbid webpack loader syntax in imports
        'import/no-webpack-loader-syntax': 'off',

        // Forbid a module from importing itself
        'import/no-self-import': 'off',

        // Forbid a module from importing a module with a dependency path back to itself
        'import/no-cycle': 'off',

        // Prevent unnecessary path segments in import and require statements
        'import/no-useless-path-segments': 'off',

        // Helpful warnings:

        // Report any invalid exports, i.e. re-export of the same name
        'import/export': 'off',

        // Report use of exported name as identifier of default export
        'import/no-named-as-default': 'off',

        // Report use of exported name as property of default export
        'import/no-named-as-default-member': 'off',

        // Report imported names marked with @deprecated documentation tag
        'import/no-deprecated': 'off',

        // Forbid the use of extraneous packages
        // paths are treated both as absolute paths, and relative to process.cwd()
        'import/no-extraneous-dependencies': [
            'off',
            {
                devDependencies: [
                    '**/src/index.js', // index.js for packages like core-js, regenerator-runtime, etc..
                    '**/webpack.config.js', // webpack config
                    '**/webpack.config.*.js', // webpack config
                    '**/rollup.config.js', // rollup config
                    '**/rollup.config.*.js', // rollup config
                    '**/jest.config.js', // jest config
                    'tests/**', // common npm pattern
                    'spec/**', // mocha, rspec-like pattern
                    '**/__tests__/**', // jest pattern
                    '**/__mocks__/**', // jest pattern
                    'test.{js,jsx}', // repos with a single test file
                    'test-*.{js,jsx}', // repos with multiple top-level test files
                    '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
                ],
                optionalDependencies: false,
            },
        ],

        // Forbid the use of mutable exports with var or let
        'import/no-mutable-exports': 'off',

        // Module systems:

        // Report potentially ambiguous parse goal (script vs. module)
        'import/unambiguous': 'off',

        // Report CommonJS require calls and module.exports or exports.*
        'import/no-commonjs': 'off',

        // Report AMD require and define calls
        'import/no-amd': 'off',

        // No Node.js builtin modules
        'import/no-nodejs-modules': 'off',

        // Style guide:

        // Ensure all imports appear before other statements
        'import/first': ['off', 'absolute-first'],

        // Ensure all exports appear after other statements
        'import/exports-last': 'off',

        // Report repeated import of the same module in multiple places
        'import/no-duplicates': 'off',

        // Report namespace imports
        'import/no-namespace': 'off',

        // Ensure consistent use of file extension within the import path
        'import/extensions': ['off', 'ignorePackages', {
            js: 'never',
            mjs: 'never',
            jsx: 'never',
        }],

        // Enforce a convention in module import order
        'import/order': 'off',

        // Enforce a newline after import statements
        'import/newline-after-import': 'off',

        // Prefer a default export if module exports a single name
        'import/prefer-default-export': 'off',

        // Limit the maximum number of dependencies a module can have
        'import/max-dependencies': ['off', {max: 10}],

        // Forbid unassigned imports
        'import/no-unassigned-import': 'off',

        // Forbid named default exports
        'import/no-named-default': 'off',

        // Forbid default exports
        'import/no-default-export': 'off',

        // Forbid anonymous values as default exports
        'import/no-anonymous-default-export': 'off',

        // Prefer named exports to be grouped together in a single export declaration
        'import/group-exports': 'off',

        // Enforce a leading comment with the webpackChunkName for dynamic imports
        'import/dynamic-import-chunkname': 'off',


        // ERROR AVOIDANCE


        // enforce “for” loop update clause moving the counter in the right direction.
        'for-direction': 'off',

        // enforce return statements in getters
        'getter-return': ['off', {allowImplicit: true}],

        // disallow await inside of loops
        'no-await-in-loop': 'off',

        // disallow comparing against -0
        'no-compare-neg-zero': 'off',

        // disallow assignment operators in conditional expressions
        'no-cond-assign': ['off', 'except-parens'],

        // disallow the use of console
        'no-console': ['error', {allow: ['warn', 'error']}],

        // disallow constant expressions in conditions
        'no-constant-condition': 'off',

        // disallow control characters in regular expressions
        'no-control-regex': 'off',

        // disallow the use of debugger
        'no-debugger': 'off',

        // disallow duplicate arguments in function definitions
        'no-dupe-args': 'off',

        // disallow duplicate keys in object literals
        'no-dupe-keys': 'off',

        // disallow duplicate case labels
        'no-duplicate-case': 'off',

        // disallow empty block statements
        'no-empty': ['off', {allowEmptyCatch: true}],

        // disallow empty character classes in regular expressions
        'no-empty-character-class': 'off',

        // disallow reassigning exceptions in catch clauses
        'no-ex-assign': 'off',

        // disallow unnecessary boolean casts
        'no-extra-boolean-cast': 'off',

        // disallow unnecessary parentheses
        'no-extra-parens': 'off',

        // disallow unnecessary semicolons
        'no-extra-semi': 'off',

        // disallow reassigning function declarations
        'no-func-assign': 'off',

        // disallow variable or function declarations in nested blocks
        'no-inner-declarations': 'off',

        // disallow invalid regular expression strings in RegExp constructors
        'no-invalid-regexp': 'off',

        // disallow irregular whitespace outside of strings and comments
        'no-irregular-whitespace': 'off',

        // disallow calling global object properties as functions
        'no-obj-calls': 'off',

        // disallow calling some Object.prototype methods directly on objects
        'no-prototype-builtins': 'off',

        // disallow multiple spaces in a regular expression literal
        'no-regex-spaces': 'off',

        // disallow sparse arrays
        'no-sparse-arrays': 'off',

        // disallow template literal placeholder syntax in regular strings
        'no-template-curly-in-string': 'off',

        // disallow confusing multiline expressions
        'no-unexpected-multiline': 'off',

        // disallow unreachable statements after a return, throw, continue, or break statement
        'no-unreachable': 'off',

        // disallow control flow statements in finally blocks
        'no-unsafe-finally': 'off',

        // disallow negating the left operand of relational operators
        'no-unsafe-negation': 'off',

        // require calls to isNaN() when checking for NaN
        'use-isnan': 'off',

        // ensure JSDoc comments are valid
        'valid-jsdoc': [
            'off',
            {
                prefer: {'return': 'returns'},
                preferType: {Boolean: 'boolean', Number: 'number', object: 'Object', String: 'string'},
                requireParamDescription: false,
                requireReturn: false,
                requireReturnDescription: false,
            },
        ],

        // enforce comparing typeof expressions against valid strings
        'valid-typeof': ['off', {requireStringLiterals: true}],


        // VARIABLES


        // require or disallow initialization in variable declarations
        'init-declarations': 'off',

        // disallow catch clause parameters from shadowing variables in the outer scope
        'no-catch-shadow': 'off',

        // disallow deleting variables
        'no-delete-var': 'off',

        // disallow labels that share a name with a variable
        'no-label-var': 'off',

        // disallow specified global variables
        'no-restricted-globals': ['off'].concat(restrictedGlobals),

        // disallow variable declarations from shadowing variables declared in the outer scope
        'no-shadow': 'off',

        // disallow identifiers from shadowing restricted names
        'no-shadow-restricted-names': 'off',

        // disallow the use of undeclared variables unless mentioned in /*global */ comments
        'no-undef': 'off',

        // disallow initializing variables to undefined
        'no-undef-init': 'off',

        // disallow the use of undefined as an identifier
        'no-undefined': 'off',

        // disallow unused variables
        'no-unused-vars': [
            'off',
            {
                args: 'none',
                ignoreRestSiblings: true,
                caughtErrors: 'none',
            },
        ],

        // disallow use of variables before they are defined
        'no-use-before-define': [
            'off',
            {
                functions: false,
                classes: false,
                variables: false,
            },
        ],


        // STYLE


        // enforce linebreaks after opening and before closing array brackets
        'array-bracket-newline': ['off', 'consistent'],

        // enforce consistent spacing inside array brackets
        'array-bracket-spacing': ['off', 'never'],

        // enforce line breaks between array elements
        'array-element-newline': 'off',

        // disallow or enforce spaces inside of blocks after opening block and before closing block
        'block-spacing': ['off', 'always'],

        // enforce consistent brace style for blocks
        'brace-style': ['off', '1tbs', {allowSingleLine: true}],

        // enforce camelcase naming convention
        'camelcase': ['off', {properties: 'never'}],

        // enforce or disallow capitalization of the first letter of a comment
        'capitalized-comments': 'off',

        // require or disallow trailing commas
        'comma-dangle': ['off', 'always-multiline'],

        // enforce consistent spacing before and after commas
        'comma-spacing': 'off',

        // enforce consistent comma style
        'comma-style': [
            'off',
            'last',
            {
                exceptions: {
                    ArrayExpression: false,
                    ArrayPattern: false,
                    ArrowFunctionExpression: false,
                    CallExpression: false,
                    FunctionDeclaration: false,
                    FunctionExpression: false,
                    ImportDeclaration: false,
                    ObjectExpression: false,
                    ObjectPattern: false,
                    VariableDeclaration: false,
                    NewExpression: false,
                },
            },
        ],

        // enforce consistent spacing inside computed property brackets
        'computed-property-spacing': ['off', 'never'],

        // enforce consistent naming when capturing the current execution context
        'consistent-this': 'off',

        // require or disallow newline at the end of files
        'eol-last': ['off', 'always'],

        // require or disallow spacing between function identifiers and their invocations
        'func-call-spacing': ['off', 'never'],

        // require function names to match the name of the variable or property to which they are assigned
        'func-name-matching': 'off',

        // require or disallow named function expressions
        'func-names': 'off',

        // enforce the consistent use of either function declarations or expressions
        'func-style': ['off', 'expression', {allowArrowFunctions: true}],

        // enforce consistent line breaks inside function parentheses
        'function-paren-newline': ['off', 'consistent'],

        // disallow specified identifiers
        'id-blacklist': 'off',

        // enforce minimum and maximum identifier lengths
        'id-length': 'off',

        // require identifiers to match a specified regular expression
        'id-match': 'off',

        // enforce the location of arrow function bodies
        'implicit-arrow-linebreak': ['off', 'beside'],

        // enforce consistent indentation
        'indent': [
            'off',
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                MemberExpression: 1,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1,
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1,
                },
                CallExpression: {
                    arguments: 1,
                },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
                ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
                ignoreComments: false,
            },
        ],

        // enforce the consistent use of either double or single quotes in JSX attributes
        'jsx-quotes': ['off', 'prefer-double'],

        // enforce consistent spacing between keys and values in object literal properties
        'key-spacing': 'off',

        //  enforce consistent spacing before and after keywords
        'keyword-spacing': 'off',

        // enforce position of line comments
        'line-comment-position': 'off',

        // enforce consistent linebreak style
        'linebreak-style': 'off',

        // require empty lines around comments
        'lines-around-comment': 'off',

        // require or disallow an empty line between class members
        'lines-between-class-members': ['off', 'always', {exceptAfterSingleLine: true}],

        // enforce a maximum depth that blocks can be nested
        'max-depth': ['off', 4],

        // enforce a maximum line length
        'max-len': [
            'off',
            {
                code: 120,
                tabWidth: 4,
                ignoreComments: false,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],

        // enforce a maximum number of lines per file
        'max-lines': 'off',

        // enforce a maximum depth that callbacks can be nested
        'max-nested-callbacks': 'off',

        // enforce a maximum number of parameters in function definitions
        'max-params': 'off',

        // enforce a maximum number of statements allowed in function blocks
        'max-statements': 'off',

        // enforce a maximum number of statements allowed per line
        'max-statements-per-line': 'off',

        // enforce a particular style for multiline comments
        'multiline-comment-style': 'off',

        // enforce newlines between operands of ternary expressions
        'multiline-ternary': 'off',

        // require constructor names to begin with a capital letter
        'new-cap': [
            'off',
            {
                newIsCap: true,
                capIsNew: false,
                capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
            },
        ],

        // require parentheses when invoking a constructor with no arguments
        'new-parens': 'off',

        // require a newline after each call in a method chain
        'newline-per-chained-call': ['off', {ignoreChainWithDepth: 2}],

        // disallow Array constructors
        'no-array-constructor': 'off',

        // disallow bitwise operators
        'no-bitwise': 'off',

        // disallow continue statements
        'no-continue': 'off',

        // disallow inline comments after code
        'no-inline-comments': 'off',

        // disallow if statements as the only statement in else blocks
        'no-lonely-if': 'off',

        // disallow mixed binary operators
        'no-mixed-operators': [
            'off',
            {
                // the list of arthmetic groups disallows mixing `%` and `**`
                // with other arithmetic operators.
                groups: [
                    ['&', '|', '^', '~', '<<', '>>', '>>>'],
                    ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                    ['&&', '||'],
                    ['in', 'instanceof'],
                ],
                allowSamePrecedence: false,
            },
        ],

        // disallow mixed spaces and tabs for indentation
        'no-mixed-spaces-and-tabs': 'off',

        // disallow use of chained assignment expressions
        'no-multi-assign': 'off',

        // disallow multiple empty lines
        'no-multiple-empty-lines': ['off', {max: 2, maxEOF: 1}],

        // disallow negated conditions
        'no-negated-condition': 'off',

        // disallow nested ternary expressions
        'no-nested-ternary': 'off',

        // disallow Object constructors
        'no-new-object': 'off',

        // disallow the unary operators ++ and --
        'no-plusplus': 'off',

        // disallow specified syntax
        'no-restricted-syntax': ['off', 'WithStatement'],

        // disallow all tabs
        'no-tabs': 'off',

        // disallow ternary operators
        'no-ternary': 'off',

        // disallow trailing whitespace at the end of lines
        'no-trailing-spaces': 'off',

        // disallow dangling underscores in identifiers
        'no-underscore-dangle': 'off',

        // disallow ternary operators when simpler alternatives exist
        'no-unneeded-ternary': ['off', {defaultAssignment: false}],

        // disallow whitespace before properties
        'no-whitespace-before-property': 'off',

        // enforce the location of single-line statements
        'nonblock-statement-body-position': ['off', 'beside'],

        // enforce consistent line breaks inside braces
        'object-curly-newline': ['off', {consistent: true}],

        // enforce consistent spacing inside braces
        'object-curly-spacing': ['off', 'never'],

        // enforce placing object properties on separate lines
        'object-property-newline': ['off', {allowAllPropertiesOnSameLine: true}],

        // enforce variables to be declared either together or separately in functions
        'one-var': ['off', 'never'],

        // require or disallow newlines around variable declarations
        'one-var-declaration-per-line': ['off', 'always'],

        // require or disallow assignment operator shorthand where possible
        'operator-assignment': ['off', 'always'],

        // enforce consistent linebreak style for operators
        'operator-linebreak': ['off', 'before', {overrides: {'=': 'none'}}],

        // require or disallow padding within blocks
        'padded-blocks': ['off', 'never'],

        // require or disallow padding lines between statements
        'padding-line-between-statements': 'off',

        // require quotes around object literal property names
        'quote-props': ['off', 'consistent'],

        // enforce the consistent use of either backticks, double, or single quotes
        'quotes': ['error', 'single'],

        // require JSDoc comments
        'require-jsdoc': 'off',

        // require or disallow semicolons instead of ASI
        'semi': ['error', 'always'],

        // enforce consistent spacing before and after semicolons
        'semi-spacing': 'off',

        // enforce location of semicolons
        'semi-style': ['off', 'last'],

        // require object keys to be sorted
        'sort-keys': 'off',

        // require variables within the same declaration block to be sorted
        'sort-vars': 'off',

        // enforce consistent spacing before blocks
        'space-before-blocks': ['off', 'always'],

        // enforce consistent spacing before function definition opening parenthesis
        'space-before-function-paren': [
            'off',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            },
        ],

        // enforce consistent spacing inside parentheses
        'space-in-parens': ['off', 'never'],

        // require spacing around infix operators
        'space-infix-ops': 'off',

        // enforce consistent spacing before or after unary operators
        'space-unary-ops': ['off', {words: true, nonwords: false}],

        // require or disallow a space immediately following the // or /* in a comment
        'spaced-comment': [
            'off',
            'always',
            {
                line: {
                    exceptions: ['-', '+'],
                    markers: ['=', '!'], // space here to support sprockets directives
                },
                block: {
                    exceptions: ['-', '+'],
                    markers: ['=', '!'], // space here to support sprockets directives
                    balanced: true,
                },
            },
        ],

        // enforce spacing around colons of switch statements
        'switch-colon-spacing': 'off',

        // require or disallow spacing between template tags and their literals
        'template-tag-spacing': ['off', 'never'],

        // require or disallow Unicode byte order mark (BOM)
        'unicode-bom': ['off', 'never'],

        // require parenthesis around regex literals
        'wrap-regex': 'off',
    }
};
