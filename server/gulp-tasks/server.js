/** SERVER TASKS */


var gulp = require('gulp'),
    connect = require('gulp-connect')
;

var conf = require('../conf').conf;

gulp.task('connect', function() {
  connect.server({
    root: conf.app_cwd,
    livereload: true,
    port:8080
  });
});


gulp.task('reload', ['test_js'], function () {
  gulp.src('../webapp/*.html')
    .pipe(connect.reload());
});
 

gulp.task('watch', function () {
  gulp.watch(['../webapp/*.html', '../webapp/**/*.css', '../webapp/js/**/*.js' ], ['reload']);
});


// development server
gulp.task('server', ['connect', 'watch']);


// production server
gulp.task('server_pro', function() {
  connect.server({
    root: '../build',
    port:9000
  });
});

// production server
gulp.task('server_doc', function() {
  connect.server({
    root: './DOC_WEBAPP'
  });
});


// default task
gulp.task('default', function() {
  console.log("Máximos goleadores");
});