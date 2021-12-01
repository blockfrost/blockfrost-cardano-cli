module.exports = {
  extends: ['oclif', 'oclif-typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-console': 'off',
    'arrow-parens': [2, 'as-needed'],
    'prettier/prettier': 2,
    '@typescript-eslint/ban-ts-comment': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prefer-module': 'off',
  },
};
