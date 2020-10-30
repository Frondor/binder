module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
    'standard',
    'plugin:import/typescript',
    'plugin:jest/all',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'jest', 'standard', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2015,
    project: './tsconfig.eslint.json',
  },
  rules: {
    'prettier/prettier': 'error',
    'jest/prefer-expect-assertions': 'off',
    '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true, ignoreRestArgs: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'import/extensions': 'off',
    'import/no-unresolved': [2, { caseSensitive: false }],
  },
}
