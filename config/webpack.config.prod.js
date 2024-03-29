'use strict';

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
// const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const paths = require('./paths');
const getClientEnvironment = require('./env');


// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of Inferno are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
	throw new Error('Production builds must have NODE_ENV=production.');
}

// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css';

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
	? // Making sure that the publicPath goes back to to build folder.
	{publicPath: Array(cssFilename.split('/').length).join('../')}
	: {};

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
	// Don't attempt to continue if there are any errors.
	bail: true,
	// We generate sourcemaps in production. This is slow but gives good results.
	// You can exclude the *.map files from the build during deployment.
	devtool: 'source-map',
	// In production, we only want to load the polyfills and the app code.
	entry: [require.resolve('./polyfills'), paths.appIndexJs],
	output: {
		// The build folder.
		path: paths.appBuild,
		// Generated JS file names (with nested folders).
		// There will be one main bundle, and one file per asynchronous chunk.
		// We don't currently advertise code splitting but Webpack supports it.
		filename: 'static/js/[name].[chunkhash:8].js',
		chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
		// We inferred the "public path" (such as / or /my-project) from homepage.
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
			// as a new entry in the `exclude` list in the "url" loader.

			// "file" loader makes sure those assets end up in the `build` folder.
			// When you `import` an asset, you get its filename.
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
					/\.svg$/,
				],
				loader: 'file-loader',
				options: {
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			// "url" loader works just like "file" loader but it also embeds
			// assets smaller than specified size as data URLs to avoid requests.
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
					cacheDirectory: true,
				}
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
			// The notation here is somewhat confusing.
			// "postcss" loader applies autoprefixer to our CSS.
			// "css" loader resolves paths in CSS and adds assets as dependencies.
			// "style" loader normally turns CSS into JS modules injecting <style>,
			// but unlike in development configuration, we do something different.
			// `ExtractTextPlugin` first applies the "postcss" and "css" loaders
			// (second argument), then grabs the result CSS and puts it into a
			// separate file in our build process. This way we actually ship
			// a single CSS file in production instead of JS code injecting <style>
			// tags. If you use code splitting, however, any async bundles will still
			// use the "style" loader inside the async code so CSS from them won't be
			// in the main CSS file.
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(
					Object.assign(
						{
							fallback: 'style-loader',
							use: [
								{
									loader: 'css-loader',
									options: {
										importLoaders: 1
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
						extractTextPluginOptions
					)
				),
				// Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					Object.assign(
						{
							fallback: 'style-loader',
							use: [
								{
									loader: 'css-loader',
									options: {
										importLoaders: 1
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
								"sass-loader"
							],
						},
						extractTextPluginOptions
					)
				),
				// Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
			},
			// ** STOP ** Are you adding a new loader?
			// Remember to add the new extension(s) to the "url" loader exclusion list.
		],
	},
	plugins: [
		new DuplicatePackageCheckerPlugin(),
		// new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
		// Makes some environment variables available in index.html.
		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
		// <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
		// In production, it will be an empty string unless you specify "homepage"
		// in `package.json`, in which case it will be the pathname of that URL.
		new InterpolateHtmlPlugin(env.raw),
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
		// It is absolutely essential that NODE_ENV was set to production here.
		// Otherwise Inferno will be compiled in the very slow development mode.
		new webpack.DefinePlugin(env.stringified),
		// Minify the code.
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				screw_ie8: true, // Inferno doesn't support IE8
				warnings: false,
			},
			mangle: {
				screw_ie8: true,
			},
			output: {
				comments: false,
				screw_ie8: true,
			},
			sourceMap: true,
		}),
		// Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
		new ExtractTextPlugin({
			filename: cssFilename,
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true
		}),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
		}),
	],
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
};
