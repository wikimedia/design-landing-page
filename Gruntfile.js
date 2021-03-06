/*!
 * Grunt file
 */

module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-postcss' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.loadNpmTasks( 'grunt-svgmin' );

	// PostCSS processors without minifier
	var postCssProcessorsDev = [
		require( 'postcss-import' )(),
		require( 'postcss-custom-properties' )( {
			preserve: false
		} ),
		require( 'autoprefixer' )( {
			browsers: [
				"Android >= 2.3",
				"Chrome >= 10",
				"Edge >= 12",
				"Firefox >= 3.6",
				"IE >= 8",
				"IE_mob 11",
				"iOS >= 5.1",
				"Opera >= 12.5",
				"Safari >= 5.1"
			]
		} )
	];

	// PostCSS processors with minifier
	var postCssProcessorsMin = postCssProcessorsDev.concat( [ require( 'cssnano' )() ] );

	grunt.initConfig( {
		// Lint – Stylesheets
		stylelint: {
			src: [
				'css/*.css',
				'!node_modules/**'
			]
		},

		// Postprocessing Stylesheets
		postcss: {
			// Output unminified compiled CSS file into `build` dir
			dev: {
				options: {
					processors: postCssProcessorsDev
				},
				src: 'css/design-landing-site.css',
				dest: 'css/build/design-landing-site.concat.css'
			},
			// Output minified compiled CSS file +  src maps into `build` dir
			min: {
				options: {
					map: {
						inline: false, // save all sourcemaps as separate files...
						annotation: 'css/build/' // ...to the specified directory
					},
					processors: postCssProcessorsMin
				},
				src: 'css/design-landing-site.css',
				dest: 'css/build/design-landing-site.min.css'
			}
		},

		// Image Optimization
		svgmin: {
			options: {
				js2svg: {
					pretty: true
				},
				plugins: [{
					cleanupIDs: false
				}, {
					removeDesc: false
				}, {
					removeRasterImages: true
				}, {
					removeTitle: false
				}, {
					removeViewBox: false
				}, {
					removeXMLProcInst: false
				}, {
					sortAttrs: true
				}]
			},
			all: {
				files: [{
					expand: true,
					cwd: './',
					src: [
						'**/*.svg'
					],
					dest: './',
					ext: '.svg'
				}]
			}
		},

		// Development
		watch: {
			files: [
				'css/**/*.css',
				'!css/build/**/*.css',
				'.{stylelintrc}'
			],
			tasks: 'default'
		}
	} );

	grunt.registerTask( 'lint', [ 'stylelint' ] );
	grunt.registerTask( 'imagery', [ 'svgmin' ] );
	grunt.registerTask( 'default', [ 'lint', 'postcss:dev', 'postcss:min' ] );
};
