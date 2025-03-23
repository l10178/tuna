module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier', // 确保这是最后一个，以便覆盖前面的格式规则
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'prettier'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // 启用prettier作为ESLint规则，并设置trailingComma为none
        'prettier/prettier': ['error', {
            trailingComma: 'none'
        }, {
                usePrettierrc: true
            }],

        // React相关规则
        'react/react-in-jsx-scope': 'off', // React 17+不需要引入React
        'react/prop-types': 'off', // 使用TypeScript类型，不需要PropTypes

        // TypeScript相关规则
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
        }],

        // 一般规则
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'warn',
        'no-var': 'error',
    },
}; 