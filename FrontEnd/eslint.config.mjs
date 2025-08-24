import js from '@eslint/js';

export default [
    {
        ignores: ['dist', 'build', 'node_modules', '*.config.js', 'public']
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                process: 'readonly',
                // React globals
                React: 'readonly',
                JSX: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            // React specific rules
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            // General JavaScript rules
            'no-unused-vars': ['error', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_'
            }],
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
            // Code style
            'semi': ['error', 'always'],
            'quotes': ['error', 'single', { 'avoidEscape': true }],
            'indent': ['error', 2],
            'comma-dangle': ['error', 'always-multiline'],
            // Best practices
            'eqeqeq': ['error', 'always'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',
            // React Hooks rules (basic)
            'no-use-before-define': 'off',
        },
    },
    // Test files configuration
    {
        files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', '**/setupTests.js'],
        languageOptions: {
            globals: {
                // Jest globals
                test: 'readonly',
                expect: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly',
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
        },
    },
];
// This ESLint configuration is tailored for a React project using JavaScript and TypeScript.
// It includes rules for code quality, best practices, and React-specific guidelines.
// The configuration also handles test files with Jest globals and allows console statements in tests.
// Adjust the rules as necessary to fit your project's coding standards and practices.
// Ensure to install the necessary ESLint plugins and parsers for React and TypeScript support.
// This configuration is designed to be used with ESLint v8.x and above.
// Make sure to run ESLint with the appropriate command to check your codebase.
// Example: `eslint . --ext .js,.jsx,.ts,.tsx` to lint all relevant files in the project.
// For more information on ESLint configuration, refer to the official documentation at https://eslint.org
// and for React-specific rules, refer to https://github.com/jsx-eslint/eslint-plugin-react