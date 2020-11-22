const browsers = require('./package.json').browserslist;

module.exports = function preset(api) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV || api.env();

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          // use browser list by default, otherwise use node (if testing, etc.)
          targets: env === 'test' ? { node: 'current' } : { browsers },
          // https://babeljs.io/docs/en/babel-preset-env#modules
          modules: env === 'test' ? 'commonjs' : false,
          // only include polyfills necessary for browser
          useBuiltIns: 'entry',
          // specify the core-js version for the correct imports for this preset
          corejs: 3,
        },
      ],
      require.resolve('@babel/preset-react'),
    ],
  };
};
