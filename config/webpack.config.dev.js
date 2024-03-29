'use strict';

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('inferno-dev-utils/WatchMissingNodeModulesPlugin');
// const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const getClientEnvironment = require('./env');
const paths = require('./paths');


// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
	// You may want 'eval' instead if you prefer to see the compiled output in DevTools.
	// See the discussion in https://github.com/infernojs/create-inferno-app/issues/343.
	devtool: 'cheap-module-source-map',
	// These are the "entry points" to our application.
	// This means they will be the "root" imports that are included in JS bundle.
	// The first two entry points enable "hot" CSS and auto-refreshes for JS.
	entry: [
		// Include an alternative client for WebpackDevServer. A client's job is to
		// connect to WebpackDevServer by a socket and get notified about changes.
		// When you save a file, the client will either apply hot updates (in case
		// of CSS changes), or refresh the page (in case of JS changes). When you
		// make a syntax error, this client will display a syntax error overlay.
		// Note: instead of the default WebpackDevServer client, we use a custom one
		// to bring better experience for Create Inferno App users. You can replace
		// the line below with these two lines if you prefer the stock client:
		// require.resolve('webpack-dev-server/client') + '?/',
		// require.resolve('webpack/hot/dev-server'),
		require.resolve('inferno-dev-utils/webpackHotDevClient'),
		// We ship a few polyfills by default:
		require.resolve('./polyfills'),
		// Errors should be considered fatal in development
		require.resolve('inferno-dev-utils/crashOverlay'),
		// Finally, this is your app's code:
		paths.appIndexJs,
		// We include the app code last so that if there is a runtime error during
		// initialization, it doesn't blow up the WebpackDevServer client, and
		// changing JS code would still trigger a refresh.
	],
	output: {
		// Next line is not used in dev but WebpackDevServer crashes without it:
		path: paths.appBuild,
		// Add /* filename */ comments to generated require()s in the output.
		pathinfo: true,
		// This does not produce a real file. It's just the virtual path that is
		// served by WebpackDevServer in development. This is the JS bundle
		// containing code from all our entry points, and the Webpack runtime.
		filename: 'static/js/bundle.js',
		// This is the URL that app is served from. We use "/" in development.
		publicPath: publicPath,
	},
	resolve: {
		// This allows you to set a fallback for where Webpack should look for modules.
		// We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/infernojs/create-inferno-app/issues/253
		modules: ['node_modules'].concat(paths.nodePaths),
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebookincubator/create-react-app/issues/290
		extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
		alias: {
			'react': 'inferno-compat',
			'react-dom': 'inferno-compat',
			'pure-render-decorator': paths.appSrc + "/lib/pureRenderDecorator",
			'react-addons-css-transition-group': 'inferno-compat/lib/ReactCSSTransitionGroup'
		}
	},

	module: {
		rules: [
			// Disable require.ensure as it's not a standard language feature.
			{parser: {requireEnsure: false}},
			// First, run the linter.
			// It's important to do this before Babel processes the JS.
			{
				test: /\.(js|jsx)$/,
				enforce: 'pre',
				use: [
					{

						loader: 'eslint-loader',
					},
				],
				include: paths.appSrc,
			},
			// ** ADDING/UPDATING LOADERS **
			// The "url" loader handles all assets unless explicitly excluded.
			// The `exclude` list *must* be updated with every change to loader extensions.
			// When adding a new loader, you must add its `test`
			// as a new entry in the `exclude` list for "url" loader.

			// "file" loader makes sure those assets get served by WebpackDevServer.
			// When you `import` an asset, you get its (virtual) filename.
			// In production, they would get copied to the `build` folder.
			{
				exclude: [
					/\.html$/,
					/\.(js|jsx)$/,
					/\.tsx?$/,
					/\.s?css$/,
					/\.json$/,
					/\.bmp$/,
					/\.gif$/,
					/\.jpe?g$/,
					/\.png$/,
				],
				loader: 'file-loader',
				options: {
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			// "url" loader works like "file" loader except that it embeds assets
			// smaller than specified limit in bytes as data URLs to avoid requests.
			// A missing `test` is equivalent to a match.
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			// Process JS with Babel.
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules\/(?!(deepstream.io-client-js)\/).*/,
				loader: 'babel-loader',
				options: {

					// This is a feature of `babel-loader` for webpack (not Babel itself).
					// It enables caching results in ./node_modules/.cache/babel-loader/
					// directory for faster rebuilds.
					cacheDirectory: true,
				},
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "awesome-typescript-loader",
						options: {
							useBabel: true
						}
					}
				]
			},
			// "postcss" loader applies autoprefixer to our CSS.
			// "css" loader resolves paths in CSS and adds assets as dependencies.
			// "style" loader turns CSS into JS modules that inject <style> tags.
			// In production, we use a plugin to extract that CSS to a file, but
			// in development "style" loader enables hot editing of CSS.
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
							plugins: () => [
								autoprefixer({
									browsers: [
										'>1%',
										'last 4 versions',
										'Firefox ESR',
										'not ie < 9', // Inferno doesn't support IE8 anyway
									],
								}),
							],
						},
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
							plugins: () => [
								autoprefixer({
									browsers: [
										'>1%',
										'last 4 versions',
										'Firefox ESR',
										'not ie < 9', // Inferno doesn't support IE8 anyway
									],
								}),
							],
						},
					},
					'sass-loader'
				],
			},
			// JSON is not enabled by default in Webpack but both Node and Browserify
			// allow it implicitly so we also enable it.
			{
				test: /\.json$/,
				loader: 'json'
			},
			// ** STOP ** Are you adding a new loader?
			// Remember to add the new extension(s) to the "url" loader exclusion list.
		]
	},

	plugins: [
		new DuplicatePackageCheckerPlugin(),
		// new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
		// Makes some environment variables available in index.html.
		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
		// <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
		// In development, this will be an empty string.
		new InterpolateHtmlPlugin(env.raw),
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
		}),
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
		new webpack.DefinePlugin(env.stringified),
		// This is necessary to emit hot updates (currently CSS only):
		new webpack.HotModuleReplacementPlugin(),
		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		// See https://github.com/infernojs/create-inferno-app/issues/240
		// new CaseSensitivePathsPlugin(),
		// If you require a missing module and then `npm install` it, you still have
		// to restart the development server for Webpack to discover it. This plugin
		// makes the discovery automatic so you don't have to restart.
		// See https://github.com/infernojs/create-inferno-app/issues/186
		new WatchMissingNodeModulesPlugin(paths.appNodeModules),
	],
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	// Turn off performance hints during development because we don't do any
	// splitting or minification in interest of speed. These warnings become
	// cumbersome.
	performance: {
		hints: false,
	},
};
