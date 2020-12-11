module.exports = {
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  rules: {
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx'],
    }]
  }
}
