let path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const { getThemeColors, modifyVars } = require('./src/utils/themeUtil')
const { resolveCss } = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'

const gateway_basic = "gateway.vm64.suncoolnet.cn"
// const gateway_basic = "gateway.vm253.suncoolnet.cn"

module.exports = {
	lintOnSave: process.env.NODE_ENV === 'development',
	devServer: {
		port: 6014,
		open: false,
		overlay: {
			warnings: false,
			errors: true
		},
		proxy: {
			"/api": {
				target: `http://${gateway_basic}/`,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
			"/resources": {
				target: `http://${gateway_basic}/`,
				changeOrigin: true,
				pathRewrite: {
					'^/resources': '/resources'
				}
			}
		}
	},
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
		}
	},
	configureWebpack: config => {
		config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
		config.performance = {
			hints: false
		}
		config.plugins.push(
			new ThemeColorReplacer({
				fileName: 'static/css/theme-colors-[contenthash:8].css',
				matchColors: getThemeColors(),
				injectCss: true,
				resolveCss
			})
		)
		config.externals = {
			'BMap': 'BMap'
		}
		// Ignore all locale files of moment.js
		config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
		// 生产环境下将资源压缩成gzip格式
		if (isProd) {
			// add `CompressionWebpack` plugin to webpack plugins
			config.plugins.push(new CompressionWebpackPlugin({
				algorithm: 'gzip',
				test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
				threshold: 10240,
				minRatio: 0.8
			}))
		}
	},
	chainWebpack: config => {
		// 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
		if (isProd) {
			config.plugin('optimize-css')
				.tap(args => {
					args[0].cssnanoOptions.preset[1].colormin = false
					return args
				})
		}
		config.resolve.alias.set('~', path.join(__dirname, './node_modules'))
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: modifyVars(),
					javascriptEnabled: true
				}
			}
		}
	},
	assetsDir: 'static',
	publicPath: '/gongkai/admin',
	productionSourceMap: false,
	runtimeCompiler: true
}
