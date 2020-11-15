module.exports = {
  extends: [
    'eslint-config-airbnb',
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
  ],
  rules: {
    'import/no-named-as-default': 'off',
  }
}
