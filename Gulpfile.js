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
var fs = require('fs');

var config = {
    sassPath: './src/scss',
    cssDest: './assets/css',
    bowerDir: './bower_components',
    jsSrc: [

    ],
    jsPath: './src/js',
    jsDest: './assets/js',
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
    //gulp.watch(config.jsSrc, ['compress']);
});

gulp.task("default", ["copy", "compass", "compress"]);
