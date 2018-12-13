/* eslint-env es6 */
/* globals module, require, console */
module.exports = function (grunt) {
	'use strict';

	// Log time how long tasks take
	require("grunt-timer").init(grunt, { deferLogs: true, friendlyTime: true, color: "cyan"});





	// read ui5 app descriptor (manifest.json) => this file must exist!!!
	const ui5AppDescriptor = grunt.file.readJSON('./src/main/webapp/manifest.json');

	// get the app namespace from ui5 app descriptor
	const appNamespaceDot = ui5AppDescriptor["sap.app"].id;

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON("package.json"),

		dir: {
			srcWebapp: "src/main/webapp",
			src: 'src',
			test: 'src/test',
			dist: "dist",
			distWebapp: "dist/webapp",
			webAppResources : "src/main/resources/webAppResources"
		},

		appNamespaceSlash : appNamespaceDot.replace(new RegExp('\\.', 'g'), "/"),

		connect: {
			options: {
				port: 8080,
				hostname: "*"
			},
			src: {},
			dist: {}
		},

		clean : {
			dist : ["dist"]
		},

		//checkout : { },

		eslint: {
			options : {										// see http://eslint.org/docs/developer-guide/nodejs-api#cliengine
				useEslintrc: true, 							// default ==> use .eslintrc file, rulse: http://eslint.org/docs/rules/
				ignore : true,								// default ==> use .eslintignore file
				quiet : true								// only report errors
				//outputFile : "log/eslint.log"				// save result to file
				//format: require("eslint-tap")
			},
			//cwd: "src/main/webapp",
			src: ["<%= dir.srcWebapp %>/**/*.js"],
			test: ['<%= dir.test %>'],
			gruntfile: ['Gruntfile.js']
		},

		//openui5: { },

		openui5_connect: {
			src: {
				options: {
					appresources: [
						"<%= dir.srcWebapp %>",
						"<%= dir.webAppResources %>"
					]
				}
			},
			dist: {
				options: {
					appresources: [
						"<%= dir.distWebapp %>",
						"<%= dir.webAppResources %>"
					]
				}
			}
		},

		openui5_preload: {
			dist: {
				options: {
					resources: {
						cwd: "src/main/webapp",
						prefix: "<%= appNamespaceSlash %>",
						src : [
							"**/*.js",
							"**/*.fragment.html",
							"**/*.fragment.json",
							"**/*.fragment.xml",
							"**/*.view.html",
							"**/*.view.json",
							"**/*.view.xml",
							"**/*.properties",
							"**/manifest.json",
							"!lib/**",
							"!test/**",
							"!themes/**",
							"!localService/**"
						]
					},
					compress: true,
					dest: "<%= dir.distWebapp %>"
				},
				components: true
			},
			distdev: {
				options: {
					resources: {
						cwd: "src/main/webapp",
						prefix: "<%= appNamespaceSlash %>",
						src : [
							"**/*.js",
							"**/*.fragment.html",
							"**/*.fragment.json",
							"**/*.fragment.xml",
							"**/*.view.html",
							"**/*.view.json",
							"**/*.view.xml",
							"**/*.properties",
							"**/manifest.json",
							"!lib/**"
						]
					},
					compress: true,
					dest: "<%= dir.distWebapp %>"
				},
				components: true
			}
		},



		//uglify : { },

		jsdoc : {
			dist : {
				src: ['src/**/*.js', 'README.md'],
				options: {
					destination : 'src/main/webapp/doc'
				}
			}
		}


	});	//END grunt.initConfig

	// plugins
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-openui5");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks('grunt-jsdoc');

	// Server task
	grunt.registerTask("serve", function(target) {
		grunt.task.run("openui5_connect:" + (target || "src") + ":keepalive");
	});

	// Default: linting + run directly without build
	grunt.registerTask("default", ["eslint:src", "jsdoc", "serve:src"]);

	// linting
	grunt.registerTask("lint", ["eslint:src"]);


};