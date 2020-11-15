const browsers = require('./package.json').browserslist;

module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers,
    },
    cssnano: {},
  },
};
