const path = require('path')
const system = require('./src/config/system')
const modifyVars = require('./src/config/theme')

function resolve (dir) {
  return path.join(__dirname, dir)
}
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  publicPath: '/' + (isDev ? '' : system.code),
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].title = system.name
      args[0].baseUrl = '/' + (isDev ? '' : `${system.code}/`)
      args[0].isDev = isDev
      return args
    })
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars,
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://kong.poros-platform.10.74.20.163.nip.io/',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
}