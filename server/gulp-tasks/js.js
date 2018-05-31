/** Build JS files */

var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream')
;

var conf = require('../conf').conf;

var js_all = require('../conf').js_all; 
var js_vendor = require('../conf').js_vendor; 


/** build js */

gulp.task('js_vendor', function(){
    gulp.src([ 
        // 'lib/underscore/underscore-min.js',
        'lib/jquery/dist/jquery.min.js',
        'lib/underscore/underscore.js',
        'lib/d3-queue/d3-queue.js',
        'lib/d3/d3.min.js',
        'lib/tooltip_d3/src/tooltip.d3.js',
        'lib/select2/dist/js/select2.min.js',
        // './webapp/libs/jquery.nicescroll/dist/jquery.nicescroll.min.js'
        ], { cwd: conf.app_cwd })
        .pipe(uglify())
        .pipe(concat(js_vendor))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(conf.dest+ "js"));

});

gulp.task('js_all', function(){
    //combine all js files of the app

    gulp.src([
        'js/**/*.js',
        ], { cwd: conf.app_cwd })
        .pipe(uglify())
        .pipe(concat(js_all))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(conf.dest+ "js"));

});
