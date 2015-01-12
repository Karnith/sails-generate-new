/**
 * Module dependencies
 */

var _ = require('lodash')
	, util = require('util');



/**
 * 
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
 */
module.exports = function dataForPackageJSON (scope) {

	var sailsPkg = scope.sailsPackageJSON || {};

	// To determine the sails dep. to inject in the newly created package.json,
	// use `sails.prerelease` specified in the package.json of Sails itself.
	// If a `prerelease` version no. is not specified, just use `version`
	var sailsVersionDependency = (sailsPkg.sails && sailsPkg.sails.prerelease) || ('~' + sailsPkg.version);

	// Creating default package.json file content
	var defaultPackageJSONContent = {
		name: scope.appName,
		private: true,
		version: '0.0.0',
		description: 'a Sails application',
		keywords: [],
		dependencies: {
			'sails'      : sailsVersionDependency,
			'sails-disk' : getDependencyVersion(sailsPkg, 'sails-disk'),
			'rc'         : getDependencyVersion(sailsPkg, 'rc'),
			'include-all': getDependencyVersion(sailsPkg, 'include-all'),
			'ejs'        : getDependencyVersion(sailsPkg, 'ejs'),
			'grunt'      : getDependencyVersion(sailsPkg, 'grunt'),
			'grunt-sync' : getDependencyVersion(sailsPkg, 'grunt-sync'),
			'grunt-contrib-copy': getDependencyVersion(sailsPkg, 'grunt-contrib-copy'),
			'grunt-contrib-clean': getDependencyVersion(sailsPkg, 'grunt-contrib-clean'),
			'grunt-contrib-concat': getDependencyVersion(sailsPkg, 'grunt-contrib-concat'),
			'grunt-sails-linker': getDependencyVersion(sailsPkg, 'grunt-sails-linker'),
			'grunt-contrib-jst': getDependencyVersion(sailsPkg, 'grunt-contrib-jst'),
			'grunt-contrib-watch': getDependencyVersion(sailsPkg, 'grunt-contrib-watch'),
			'grunt-contrib-uglify': getDependencyVersion(sailsPkg, 'grunt-contrib-uglify'),
			'grunt-contrib-cssmin': getDependencyVersion(sailsPkg, 'grunt-contrib-cssmin'),
			'grunt-contrib-less': getDependencyVersion(sailsPkg, 'grunt-contrib-less'),
			'grunt-contrib-coffee': getDependencyVersion(sailsPkg, 'grunt-contrib-coffee')
		},
		scripts: {
			start: 'node app.js',
			debug: 'node debug app.js'
		},
		main: 'app.js',
		repository: {
			type: 'git',
			url: util.format('git://github.com/%s/%s.git', scope.github.username, scope.appName)
		},
		author: scope.author || '',
		license: ''
	};

	//
	// Check for `packagejson` configuration
	//

	if (scope.packagejson && _.isObject(scope.packagejson)) {
		//
		// Adding new dependencies to package.json
		//
		_.merge(defaultPackageJSONContent, (scope.packagejson || {}));

		//
		// Remove dependencies that has false as version
		// If somebody don't need dependency it could be removed using passing to scope:
		//
		// ```
		// packagejson: {
		// 		dependencies: {
		// 			ejs: false
		// 		}
		// }
		// ```
		//
		if (scope.packagejson.dependencies) {
			_.omit(defaultPackageJSONContent.dependencies, function(value) {
				return value === false;
			});
		}
	}

	return _.defaults(scope.appPackageJSON || {}, defaultPackageJSONContent);
};





/**
 * getDependencyVersion
 * 
 * @param  {Object} packageJSON
 * @param  {String} module
 * @return {String}
 * @api private
 */

function getDependencyVersion (packageJSON, module) {
	return (
		packageJSON.dependencies && packageJSON.dependencies[module] ||
		packageJSON.devDependencies && packageJSON.devDependencies[module] ||
		packageJSON.optionalDependencies && packageJSON.optionalDependencies[module]
	);
}
