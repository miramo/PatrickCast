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
var fs = require('fs');

var config = {
    sassPath: './scss',
    cssDest: './assets/css',
    bowerDir: './bower_components',
    jsSrc: [

    ],
    jsPath: './js',
    jsDest: './assets/js',
    imgPath: './img',
    imgDest: './assets/img',
    configRb: './config.rb'
}

var plumberErrorHandler = {
    errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }
};

gulp.task('compass', function() {
    return gulp.src(config.sassPath + '/**/*')
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
            config_file: config.configRb,
            css: 'assets/css',
            sass: 'scss',
            scss: 'scss',
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

gulp.task('images', function(cb) {
    return gulp.src(config.imgPath + '/**/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.imgDest));
});

gulp.task("bower-restore", function () {
    return bower();
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(config.sassPath + '/**/*', ['compass']);
    //gulp.watch(config.jsSrc, ['compress']);
});

gulp.task("default", ["compass", "compress"]);