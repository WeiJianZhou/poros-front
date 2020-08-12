const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const system = require('./src/config/system')
const modifyVars = require('./src/config/theme')

function resolve (dir) {
  return path.join(__dirname, dir)
}
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  productionSourceMap: false,
  publicPath: '/' + (isDev ? '' : system.code),
  configureWebpack: {
    plugins: [
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require('./public/vendor/vendor-manifest.json')
      })
    ]
  },
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].title = system.name
      args[0].baseUrl = '/' + (isDev ? '' : `${system.code}/`)
      args[0].isDev = isDev
      return args
    })
    config.plugins.delete('prefetch')
    // ie兼容
    config.entry('main').add('babel-polyfill')
    // 处理svg图片
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

    if (!isDev) {
      // 开启gzip
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          test:/\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }))
        .end()
    }
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