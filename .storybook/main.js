const path = require('path');
const cracoConfig = require('../craco.config.js')();

const toPath = _path => path.join(process.cwd(), _path);

module.exports = {
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  babel: (config) => {
    config.presets.push(require.resolve('@emotion/babel-preset-css-prop'));
    return config;
  },
  webpackFinal: async (config) => {
    const environment = process.env.REACT_APP_ENVIRONMENT || 'prod';

    config.module.rules[5].oneOf[2].options.presets = [
      config.module.rules[5].oneOf[2].options.presets[1],
      config.module.rules[5].oneOf[2].options.presets[0],
    ];
    const cracoAliases = (cracoConfig.plugins || [])[0] && (cracoConfig.plugins || [])[0].options.aliases;
    const aliases = {};
    Object.entries(cracoAliases || {}).forEach(
      ([key, val]) => (aliases[key] = path.resolve(__dirname, `.${ val }`)),
    );
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve && config.resolve.alias || {}),
          ...aliases,
          '@emotion/css': toPath('node_modules/@emotion/css'),
          '@emotion/core': toPath('node_modules/@emotion/react'),
          '@emotion/styled': toPath('node_modules/@emotion/styled'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
        },
      },
      plugins: [
        ...config.plugins,
        ...cracoConfig.webpack.plugins,
      ],
    };
  },
};
