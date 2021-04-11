/* eslint-disable @typescript-eslint/no-var-requires */
const reactHotReloadPlugin = require('./craco/craco-plugin-react-hot-reload')
const CracoLessPlugin = require('craco-less');
const webpack = require('webpack');

module.exports = function () {
  const environment = process.env.REACT_APP_ENVIRONMENT || 'prod';

  return {
    plugins: [
      {
        plugin: reactHotReloadPlugin
      },
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
    webpack: {
      alias: { './dist/cpexcel.js': '' },
      module: {
        rules: [
          {
            test: /\.(mp3|wav|flac|ogg)$/,
            use: 'file-loader',
          },
          {
            test: /assets\/images\/inline\/(.*)\.png$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: false
                },
              },
            ],
          }
        ],
      },
      plugins: [
        new webpack.NormalModuleReplacementPlugin(/(.*).prod(\.*)/, function (resource) {
          resource.request = resource.request.replace(/.prod/, `.${environment}`);
        }),
      ],
    },
    babel: {
      plugins: [
        '@emotion'
      ]
    }
  };
};

