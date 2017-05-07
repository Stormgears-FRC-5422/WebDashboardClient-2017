module.exports = {
	entry: "./server/production.js",
	output: {
		path: "build-server",
		filename: "server.js",
	},
	module: {
		rules: [
			{
				test: /(?:env|deepstream\.io)\.js$/, // superstatic, deepstream
				loader: "transform-loader?brfs"
			},
			{
				test: /\.node$/,
				use: 'node-native-loader'
			}
		]
	},
	resolve: {
		extensions: [".js", ".json", ".node"]
	},
	target: "node",
	externals: {
		// uws: "commonjs uws",
		// "deepstream.io": "commonjs deepstream.io",
		nexeres: "commonjs nexeres",
		vertx: "commonjs vertx",
		xml2js: "commonjs xml2js"
	}
};