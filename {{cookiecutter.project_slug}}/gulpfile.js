/* global require */

var gulp = require('gulp');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var pump = require('pump');

// CSS processors
var sass = require('gulp-sass');

// Post CSS transformations
var postcss = require('gulp-postcss');
var atImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// Browser auto refresh/reload
var browserSync = require('browser-sync').create();


gulp.task('sass', function(cb) {
    'use strict';

    var processors = [
        atImport(),
        autoprefixer()
    ];

    if (util.env.production === true) {
        processors.push(cssnano());
    }

    pump([
        gulp.src(['./htdocs/static/scss/*.scss', '!**/_*.scss']),
        sourcemaps.init(),
        sass({
            includePaths: ['node_modules/normalize-scss/sass']
        }),
        postcss(processors),
        sourcemaps.write('.'),
        gulp.dest('./htdocs/static/css'),
        browserSync.stream({match: '**/*.css'})
    ], cb);
});

gulp.task('default', ['sass']);

gulp.task('serve', ['default'], function() {
    'use strict';

    browserSync.init({
        server: {
            baseDir: "./htdocs"
        }
    });

    gulp.watch('./htdocs/static/scss/**/*', ['sass']);
});
