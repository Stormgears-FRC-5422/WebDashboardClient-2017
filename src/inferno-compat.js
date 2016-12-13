/**
 * Created by andrew on 12/12/16.
 */
import infernoCompat from "inferno-compat";

module.exports = {
	createFactory: function(type) {
		var factory = infernoCompat.createElement.bind(null, type);
		factory.type = type;
		return factory;
	},
	...infernoCompat
};