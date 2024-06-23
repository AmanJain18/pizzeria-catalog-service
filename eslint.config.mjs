import globals from 'globals';
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
    {
        files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
        ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
            },
            globals: globals.node,
        },
        plugins: {
            '@typescript-eslint': ts,
        },
        rules: {
            'no-console': 'error',
            'dot-notation': 'error',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        },
    },
    js.configs.recommended,
    ts.configs['recommended-type-checked'],
    prettier,
];
