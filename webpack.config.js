const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function config(env = { development: true }) {
  const distPath = 'frontend/public/dist';
  const buildPath = `${__dirname}/${distPath}`;
  const entrypointsPath = './frontend/entrypoints';
  const outputCssName = '[name].css';
  const outputJsName = '[name].js';
  const sourceMap = true;

  return {
    devServer: {
      contentBase: buildPath,
      compress: true,
      // make accessible outside of container
      host: '0.0.0.0',
      port: 8080,
      // permits backend's service to webpack-dev-server
      // https://stackoverflow.com/a/43621275
      public: '0.0.0.0',
      allowedHosts: [
        'localhost',
        'frontend',
      ],
      hot: !env.production,
    },
    // webpack does builtin optimizations accordingly
    mode: env.production ? 'production' : 'development',
    // make every js file in src/entrypoints an entrypoint
    entry: glob.sync(`${entrypointsPath}/**/*.js`).reduce((entries, filePath) => {
      // the file name without the .js will be the entrypoint name
      const name = filePath.substring(
        filePath.lastIndexOf('/') + 1,
        filePath.lastIndexOf('.'),
      );
      return {
        ...entries,
        [name]: filePath,
      };
    }, {}),
    // just keep their file names
    output: {
      path: buildPath,
      filename: outputJsName,
    },
    // use source maps
    devtool: 'source-map',
    module: {
      rules: [
        // lint js files
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'eslint-loader',
        },
        // babel
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap,
                // 2 => postcss-loader, less-loader|sass-loader applied before css-loader
                // https://webpack.js.org/loaders/css-loader/#importloaders
                importLoaders: 2,
              },
            },
            {
              // "postcss" loader applies autoprefixer and cssnano minification to CSS.
              loader: 'postcss-loader',
              options: {
                sourceMap,
                config: {
                  path: __dirname,
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap,
                lessOptions: {
                  // paths: paths.cssIncludePaths,
                  sourceMap: sourceMap ? {} : null,
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: env.production,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        chunks: 'all',
        minChunks: Infinity,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          default: {
            chunks: 'all',
            minChunks: Infinity,
          },
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: outputCssName,
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: '/',
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            return {
              ...manifest,
              [file.name]: file.path,
            };
          }, seed);
          const manifestEntrypoints = Object.keys(entrypoints).reduce((manifest, entrypoint) => {
            return {
              ...manifest,
              [entrypoint]: entrypoints[entrypoint].reduce((entrypointFiles, file) => {
                // filtering like this will always ignore .map files
                if (file.endsWith('.css')) {
                  entrypointFiles.css.push(file);
                }
                if (file.endsWith('.js')) {
                  entrypointFiles.js.push(file);
                }
                return entrypointFiles;
              }, {
                css: [],
                js: [],
              }),
            };
          }, {});

          return {
            files: manifestFiles,
            entrypoints: manifestEntrypoints,
          };
        },
      }),
    ],
  };
};

console.log(module.exports(), null, 2);
