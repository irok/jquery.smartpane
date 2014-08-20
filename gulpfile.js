/* global require */

var pkg   = require('./package.json');
var gulp  = require('gulp');
var $     = require('gulp-load-plugins')();

var srcfile = 'src/jquery.smartpane.js';

$.banner = function() {
    return $.header([
        '/**',
        ' * <%= pkg.title %> v<%= pkg.version %>',
        ' * <%= pkg.homepage %>',
        ' *',
        ' * Copyright 2013 <%= pkg.author %>',
        ' * Released under the MIT license',
        ' * <%= pkg.homepage %>/blob/master/LICENSE',
        ' *',
        ' * Date: <%= $.util.date("isoUtcDateTime") %>',
        ' */',
        ''].join('\n'),
        { 'pkg': pkg, '$': $ }
    );
};

$.minBanner = function() {
    return $.header([
        '/*!',
        ' * <%= pkg.title %> v<%= pkg.version %>',
        ' * (c) 2014 <%= pkg.author %>',
        ' * MIT license',
        ' */',
        ''].join('\n'),
        { 'pkg': pkg, '$': $ }
    );
};

gulp.task('default', function() {
    gulp.watch(srcfile, ['jshint']);
});

gulp.task('build', function() {
    return gulp.src(srcfile)
        .pipe($.banner())
        .pipe(gulp.dest('dist/'))
        .pipe($.sourcemaps.init())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minBanner())
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.sourcemaps.write('./', {includeContent: false}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('jshint', function() {
    return gulp.src(srcfile)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});
