module.exports = {
  extends: [
    'eslint-config-airbnb',
    'eslint-config-airbnb/hooks',
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
  ],
  rules: {
    'import/no-named-as-default': 'off',
    // complains about importing devDependencies but this is pretty opinionated
    // i.e. create-react-app believes webpack, etc. are devDependencies
    'import/no-extraneous-dependencies': 'off',
    'jsx-a11y/label-has-associated-control': [2, {
      assert: 'either',
    }],
  },
  settings: {
    // make eslint understand node and webpack imports
    // https://www.npmjs.com/package/eslint-import-resolver-node
    // https://www.npmjs.com/package/eslint-import-resolver-webpack
    'import/resolver': {
      node: {},
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
};
