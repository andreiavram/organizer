var gulp = require('gulp');
var browserSync = require('browser-sync');
var less = require('gulp-less');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var copy = require('gulp-copy');
var ignore = require('gulp-ignore');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var gulpFilter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var rename = require('gulp-rename')

var BOWER_PATH = './bower_components/';
var APP_PATH = './public/';
var BUILD_PATH = './static/'

gulp.task('server', function() {
    browserSync({
        server: {
            baseDir: APP_PATH
        },
        open: false,
        host: '127.0.0.1'
    });
});

gulp.task('less', function() {
    return gulp.src(APP_PATH + 'modules/**/*.less')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(APP_PATH + 'static/css/'));
});

gulp.task('css', function() {
    "use strict";
    var cssFilter = gulpFilter(['**/*.css', '**/*.less',
        '**/ng-tags-input.bootstrap.css'], {restore: true});
    return gulp.src(mainBowerFiles(), { "base": BOWER_PATH })
        .pipe(cssFilter)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(APP_PATH + "static/css/"));
});

gulp.task('fonts', function() {
    "use strict";
    return gulp.src([BOWER_PATH + '**/fonts/*'])
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(APP_PATH + "static/fonts/"));
});

gulp.task('js', function() {
    return browserify(APP_PATH + 'main.js', {
            paths: ['./node_modules', './public/modules'],
            debug: true
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(APP_PATH + 'static/js/'));
});

gulp.task('copy-assets', function() {
  return gulp.src(APP_PATH + 'modules/**/assets/**/*')
                .pipe(ignore.exclude('**/*.less'))
                .pipe(copy(APP_PATH + 'static/', {prefix: 4}));
});

gulp.task('less-no-sm', function() {
    return gulp.src(APP_PATH + 'modules/**/*.less')
        .pipe(less())
        .pipe(concat('bundle.css'))
        .pipe(minifyCss({}))
        .pipe(gulp.dest(APP_PATH + 'static/css/'));
});

gulp.task('js-no-sm', function() {
    return browserify(APP_PATH + 'main.js', {
            paths: ['./node_modules', './public/modules'],
            debug: true
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(APP_PATH + 'static/js/'));
});

gulp.task('clean-build', function(cb) {
    return gulp.src(BUILD_PATH, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('copy-build', ['clean-build'], function() {
    return gulp.src(APP_PATH + 'static/**/*')
        .pipe(copy(BUILD_PATH, {prefix: 2}));
});

gulp.task('copy-bower', function() {
    return gulp.src(BOWER_PATH + '/*/dist/**/*')
        .pipe(copy(APP_PATH + 'static/libs', {prefix: 1}));
});

gulp.task('lint', function() {
    return gulp.src(APP_PATH + 'modules/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('setup', ['copy-bower', 'copy-assets']);

gulp.task('serve', ['setup', 'lint', 'less', 'css', 'fonts', 'js', 'server'], function() {
    return gulp.watch(
        [APP_PATH + 'modules/**/*.*', APP_PATH + 'main.js', APP_PATH + 'config.js', APP_PATH + 'index.html'],
        ['copy-assets', 'lint', 'less', 'js', browserSync.reload]);
});

gulp.task('build', ['setup', 'lint', 'less', 'css', 'fonts', 'js', 'copy-build']);
gulp.task('build-debug', ['setup', 'lint', 'less-no-sm', 'css', 'fonts', 'js-no-sm', 'copy-build']);
