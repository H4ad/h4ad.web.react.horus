module.exports = {
  overrideWebpackConfig: ({ webpackConfig, context: { env } }) => {
    if (env === 'production') {
      return webpackConfig
    }

    const conf = webpackConfig

    if (!conf || !conf.module || !conf.module.rules) {
      return webpackConfig
    }

    const condition = u => typeof u === 'object' && u.loader && u.loader.includes('eslint-loader')
    const rule = conf.module.rules.find(rule => rule.use && rule.use.some(condition))

    if (rule) {
      const use = rule.use.find(condition)
      if (use) {
        use.options.emitWarning = true
      }
    }

    return conf
  },

  overrideCracoConfig: ({ cracoConfig }) => {
    if (!cracoConfig.webpack) {
      cracoConfig.webpack = {}
    }
    if (!cracoConfig.webpack.alias) {
      cracoConfig.webpack.alias = {}
    }

    const babelConfig = cracoConfig.babel || {}
    const babelPlugins = babelConfig.plugins || []

    return {
      ...cracoConfig,
      babel: {
        ...babelConfig,
        plugins: [...babelPlugins, 'react-hot-loader/babel']
      }
    }
  }
}
