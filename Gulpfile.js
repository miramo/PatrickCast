var gulp = require('gulp');
var compass  = require('gulp-compass');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var minifyHtml = require("gulp-minify-html");
var ngAnnotate = require('gulp-ng-annotate');
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var fs = require('fs');

var compressing = true;

var config = {
    sassPath: './src/scss',
    cssDest: './assets/css',
    styleBowerPath: [
        './bower_components/angular-material/angular-material.min.css',
        './bower_components/angular-chart.js/dist/angular-chart.min.css',
    ],
    styleBowerDest: './assets/css/bower-final.min.css',
    jsBowerPath: [
        './bower_components/angular/angular.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/angular-aria/angular-aria.min.js',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/angular-material/angular-material.min.js',
        './bower_components/underscore/underscore-min.js',
        './bower_components/Chart.js/Chart.min.js',
        './bower_components/angular-chart.js/dist/angular-chart.min.js',
        './bower_components/angular-md5/angular-md5.min.js',
    ],
    jsBowerDest: './assets/js/bower-final.min.js',
    jsPath: './src/js/**/*.js',
    jsDest: './assets/js/anc-final.min.js',
    imgPath: './src/img',
    imgDest: './assets/img',
    viewsPath: './src/views',
    viewsDest: './views',
    indexPath: './src/index.html',
    indexDest: './',
    configRb: './config.rb'
}

var plumberErrorHandler = {
    errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }
};

gulp.task("min:jsBower", function () {
    return gulp.src(config.jsBowerPath)
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat(config.jsBowerDest))
        //.pipe(uglify())
        .pipe(gulp.dest("."))
        .pipe(notify({ message: 'Compress jsBower task complete' }));
});
gulp.task("min:js", function () {
    return gulp.src(config.jsPath)
        .pipe(jshint())
        .pipe(plumber(plumberErrorHandler))
        .pipe(ngAnnotate())
        .pipe(concat(config.jsDest))
        .pipe(gulpif(compressing, uglify()))
        .pipe(gulp.dest("."))
        .pipe(livereload())
        .pipe(notify({ message: 'Compress js task complete' }));
});
gulp.task("min", ["min:js", "min:jsBower"]);

gulp.task('style:compass', function() {
    return gulp.src(config.sassPath + '/app.scss')
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
            config_file: config.configRb,
            css: 'assets/css',
            sass: 'src/scss',
            scss: 'src/scss',
            image: 'assets/img'
        }))
        .pipe(gulp.dest(config.cssDest))
        .on('error', gutil.log)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpif(compressing, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest(config.cssDest))
        .pipe(livereload())
        .pipe(notify({ message: 'Compass task complete' }));
});
gulp.task('style:bower', function() {
    return gulp.src(config.styleBowerPath)
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat(config.styleBowerDest))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("."))
        .pipe(notify({ message: 'Style Bower task complete' }));
});
gulp.task("style", ["style:compass", "style:bower"]);

gulp.task('copy:imgs', function(cb) {
    return gulp.src(config.imgPath + '/**/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.imgDest));
});

gulp.task('copy:views', function() {
    return gulp.src(config.viewsPath + '/**/*')
        .pipe(minifyHtml({ empty: true }))
        .pipe(gulp.dest(config.viewsDest))
        .pipe(livereload());
});

gulp.task('copy:index', function() {
    return gulp.src(config.indexPath)
        .pipe(minifyHtml({ empty: true }))
        .pipe(gulp.dest(config.indexDest))
        .pipe(livereload())
        .pipe(notify({ message: 'Index task complete' }));
});
gulp.task("copy", ["copy:imgs", "copy:views", "copy:index"]);

gulp.task("bower-restore", function () {
    return bower();
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(config.sassPath + '/**/*', ['style:compass']);
    gulp.watch(config.viewsPath + '/**/*', ['copy:views']);
    gulp.watch(config.indexPath, ['copy:index']);
    gulp.watch(config.jsPath, ['min:js']);
    //gulp.watch(config.jsSrc, ['compress']);
});

gulp.task("default", ["copy", "style", "min"]);
