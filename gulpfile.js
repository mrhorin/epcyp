var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jade = require("gulp-jade");
var del = require('del');

// jadeコンパイル
gulp.task('jade', function(){
  gulp.src('src/jade/**/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy', function() {
  gulp.src('./src/js/main.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function(cb) {
  del(['dist', '**/*.log'], cb);
});

gulp.task('default', ['copy', 'jade']);
