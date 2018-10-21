var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    minifycss = require('gulp-minify-css'),
    revCollector = require('gulp-rev-collector'),
    notify = require('gulp-notify'),
    rev = require('gulp-rev'),
    watch=require('gulp-watch'),
    connect = require('gulp-connect'),
    babel = require("gulp-babel"),
    es2015 = require("babel-preset-es2015"),
    webpack = require('webpack'),
    plugins = require('gulp-load-plugins')(),
    path = require('path');

    var browserSync = require('browser-sync');
    var reload = browserSync.reload;
    var paths = {
        src: 'assets', // css js img 开发目录
        less: 'assets/less', // less 开发目录
        dist: 'dist', // release 发行目录
        rev: 'rev',
        html: 'tmpls/**/*.html' // html 页面
    };

var host = {
    path: './',
    port: 3000,
    html: 'index.html'
};

//本机开发用
gulp.task('default',['webpack'], function(done){
connect.server(host);
//gulp.watch('classes/*.js', ['webpack']);
gulp.watch('*.js', ['webpack']);
});

gulp.task("webpack", function(callback) {

    return gulp.src('')
        .pipe(plugins.webpack(require('./webpack.config.js'), webpack))
        .pipe(gulp.dest(paths.dist + '/js'))
        .pipe(reload({
            stream: true
        }))
        .pipe(plugins.notify({
            message: 'webpack task ok'
        }));

});
