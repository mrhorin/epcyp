var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jade = require("gulp-jade");
var del = require('del');
var packager = require('electron-packager');
var package = require("./package.json");

gulp.task('watch', function(){
  gulp.watch(['src/jade/**/*.jade'], ['jade']);
});

// jadeコンパイル
gulp.task('jade', function(){
  gulp.src('src/jade/**/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'));
});

// distを空に
gulp.task('clean', function(cb) {
  del(['dist', '**/*.log'], cb);
});

// OSX用にパッケージ化
gulp.task('package:darwin', ['default'], function (done) {
  packager({
    dir: './',
    out: 'release/darwin',
    name: package["name"],
    icon: "./src/img/icon/darwin/icon_1024x1024.icns",
    "app-version": package["version"],
    "app-copyright": "Copyright (C) 2016 "+package["author"]+".",
    arch: 'x64',
    platform: 'darwin',
    overwrite: true,
    version: '1.4.13',
    ignore: ['release']
  }, function (err, path) {
    done();
  });
});

// Linux用にパッケージ化
gulp.task('package:linux', ['default'], function (done) {
  packager({
    dir: './',
    out: 'release/linux',
    name: package["name"],
    icon: "./src/img/icon/darwin/icon_1024x1024.icns",
    "app-version": package["version"],
    "app-copyright": "Copyright (C) 2016 "+package["author"]+".",
    arch: 'x64',
    platform: 'linux',
    overwrite: true,
    version: '1.4.13',
    ignore: ['release']
  }, function (err, path) {
    done();
  });
});

gulp.task('default', ['jade']);
