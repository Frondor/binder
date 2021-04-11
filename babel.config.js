const isTest = process.env.NODE_ENV === 'test'

const presetEnvOptions = {
  debug: false,
  useBuiltIns: false,
  targets: {
    browsers: ['> 0.25%', 'last 2 versions', 'not ie < 11'],
  },
}

if (!isTest) presetEnvOptions.modules = false

module.exports = function (api) {
  api.cache(true)
  const presets = [['@babel/preset-env', presetEnvOptions]]

  return { presets }
}
