var gulp = require('gulp');
var compass  = require('gulp-compass');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
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
var fs = require('fs');

var config = {
    sassPath: './src/scss',
    cssDest: './assets/css',
    jsBowerPath: [
        './bower_components/angular/angular.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/angular-aria/angular-aria.min.js',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/angular-material/angular-material.min.js',
        './bower_components/underscore/underscore-min.js',
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
        .pipe(uglify())
        .pipe(gulp.dest("."))
        .pipe(notify({ message: 'Compress jsBower task complete' }));
});
gulp.task("min:js", function () {
    return gulp.src(config.jsPath)
        .pipe(plumber(plumberErrorHandler))
        .pipe(ngAnnotate())
        .pipe(concat(config.jsDest))
        //.pipe(uglify())
        .pipe(gulp.dest("."))
        .pipe(livereload())
        .pipe(notify({ message: 'Compress js task complete' }));
});
gulp.task("min", ["min:js", "min:jsBower"]);

gulp.task('compass', function() {
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
        .pipe(minifycss({processImport: false}))
        .pipe(gulp.dest(config.cssDest))
        .pipe(livereload())
        .pipe(notify({ message: 'Compass task complete' }));
});

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
    gulp.watch(config.sassPath + '/**/*', ['compass']);
    gulp.watch(config.viewsPath + '/**/*', ['copy:views']);
    gulp.watch(config.indexPath, ['copy:index']);
    gulp.watch(config.jsPath, ['min:js']);
    //gulp.watch(config.jsSrc, ['compress']);
});

gulp.task("default", ["copy", "compass", "min"]);
