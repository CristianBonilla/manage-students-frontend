import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

export default defineConfig([
  globalIgnores(['projects/**/*']),
  {
    files: ['**/*.ts'],
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@angular-eslint/recommended',
      'plugin:@angular-eslint/template/process-inline-templates'
    ),
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'msf',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'msf',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        {
          accessibility: 'explicit',

          overrides: {
            accessors: 'off',
            constructors: 'off',
            methods: 'off',
            properties: 'off',
            parameterProperties: 'explicit',
          },
        },
      ],
      '@typescript-eslint/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },

          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'private-static-field',
            'protected-static-field',
            'public-static-field',
            'private-instance-field',
            'protected-instance-field',
            'public-instance-field',
            'constructor',
            'protected-static-method',
            'public-static-method',
            'private-static-method',
            'protected-instance-method',
            'public-instance-method',
            'private-instance-method',
          ],
        },
      ],
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/quotes': ['warn', 'single'],
      '@typescript-eslint/semi': ['warn', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/comma-dangle': [
        'warn',
        {
          objects: 'never',
          arrays: 'never',
          functions: 'never',
          imports: 'never',
          exports: 'never',
          enums: 'never',
          generics: 'never',
          tuples: 'never',
        },
      ],
      'no-var': 'error',
      'comma-dangle': 'off',
      curly: 'error',
      'space-before-function-paren': 'off',
      'template-curly-spacing': ['warn', 'always'],
      'no-trailing-spaces': [
        'warn',
        {
          skipBlankLines: false,
          ignoreComments: false,
        },
      ],
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: compat.extends(
      'plugin:@angular-eslint/template/recommended',
      'plugin:@angular-eslint/template/accessibility'
    ),
    rules: {},
  },
]);
