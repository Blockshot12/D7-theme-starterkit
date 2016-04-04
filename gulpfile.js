/**
 * Gulpfile.
 *
 * Implements:
 * 			1. Sass to CSS conversion + uglify
 * 			2. JS concatenation + uglify
 *      3. Vendor JS concatenation + uglify
 *      4. Images minify
 *      5. Fonts minify
 *      6. PHP files
 *      7. Browser-Sync
 * 			8. Watch files
 *
 * @since 1.0.0
 * @author Blockshot
 */
'use strict';

/**
 * Configuration: Project variables
 */
var project             = 'Starterkit',
    projectUrl          = 'Proxy to your local Drupal site',

    styleSrc            = './src/scss/**/*.scss',
    styleDest           = './dist/css',

    jsSrc               = './src/js/**/*.js',
    jsDest              = './dist/js/',
    jsFile              = 'scripts',

    jsVendorSrc         = './bower_components/**/*.min.js',
    jsVendorDest        = './dist/js/vendors/',

    fontSrc             = './src/fonts/**/*.ttf',
    fontDest            = './dist/fonts',

    imgSrc              = './src/img/**/*',
    imgDest             = './dist/img',

    phpSrc              = './**/*.php';

/**
 * Configuration: Load plugins
 */
var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    browserSync   = require('browser-sync').create(),
    reload        = browserSync.reload;

/**
 * Task: Sass
 */
gulp.task('sass', function() {
  return gulp.src(styleSrc)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
		.pipe($.sass({
			errLogToConsole: true,
			outputStyle: 'compact',
			// outputStyle: 'compressed',
			// outputStyle: 'nested',
			// outputStyle: 'expanded',
			precision: 10
		}))
		.pipe($.sourcemaps.write({includeContent:false}))
		.pipe($.sourcemaps.init({loadMaps:true}))
		.pipe($.autoprefixer(
			'last 2 version',
			'> 1%',
			'safari 5',
			'ie 8',
			'ie 9',
			'opera 12.1',
			'ios 6',
			'android 4'))
    .pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(styleDest))
    .pipe($.rename({suffix:'.min'}))
		.pipe($.uglifycss())
		.pipe(gulp.dest(styleDest))
    .pipe(reload({stream: true}))
		.pipe($.notify({message: 'Sass task completed', onLast:true }));
});

/**
 * Task: JS
 */
gulp.task('js', function() {
  return gulp.src(jsSrc)
		.pipe($.concat(jsFile + '.js'))
		.pipe(gulp.dest(jsDest))
		.pipe($.rename( {
			basename: jsFile,
			suffix: '.min'
		}))
		.pipe($.uglify() )
		.pipe(gulp.dest(jsDest))
    .pipe(reload({stream: true}))
		.pipe($.notify({message: 'JS task completed', onLast:true}));
});

/**
 * Task: Flatten (Vendor JS)
 */
gulp.task('flatten', function() {
  return gulp.src(jsVendorSrc)
		.pipe($.flatten())
		.pipe(gulp.dest(jsVendorDest))
    .pipe(reload({stream: true}))
		.pipe($.notify({message: 'JS Vendors task completed', onLast:true}));
});

/**
 * Task: IMG
 */
gulp.task('img', function() {
  return gulp.src(imgSrc)
    .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(imgDest))
    .pipe(reload({stream: true}))
    .pipe($.notify({ message: 'Images task completed', onLast:true}));
});

/**
 * Task: Font
 */
gulp.task('fontmin', function() {
  return gulp.src(fontSrc)
    .pipe($.fontmin())
    .pipe(gulp.dest(fontDest))
    .pipe(reload({stream: true}))
    .pipe($.notify({message: 'Fonts task completed', onLast:true}));
});

/**
 * Task: PHP
 */
gulp.task('php', function() {
  return gulp.src(phpSrc)
    .pipe(reload({stream: true}))
    .pipe($.notify({message: 'PHP task completed', onLast:true}));
});

/**
 * Task: Browser-Sync
 */
gulp.task('browser-sync', function() {
  //
  var files = [
    styleSrc,
    jsSrc,
    imgSrc,
    phpSrc
  ];

  browserSync.init(files, {
    proxy: projectUrl
  });
});

/**
 * Task: Watch
 */
gulp.task('watch', function(){
	gulp.watch(styleSrc, ['sass']);
	gulp.watch(jsSrc, ['js']);
	gulp.watch(imgSrc, ['img']);
  gulp.watch(phpSrc, ['php']);
})

gulp.task('default', ['sass','js','flatten','img','php','browser-sync','watch']);
