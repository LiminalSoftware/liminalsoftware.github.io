var gulp = require('gulp');
var livereload = require('gulp-livereload');
var del = require('del');
var rename = require('gulp-rename');

var postcss = require('gulp-postcss');

var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');
var lost = require('lost');
var checkCSS = require('gulp-check-unused-css');

var minmax = require('postcss-media-minmax');

gulp.task('express', function () {
  var express = require('express');
  var app = express();
  app.use(express.static(__dirname));
  app.listen(4034, '0.0.0.0');
});


gulp.task('css', function () {
  var processors = [
    autoprefixer,
    cssnext,
    precss,
    lost,
    minmax()
  ];
  return gulp.src('./src/style.css')
    .pipe(postcss(processors))
    .pipe(rename('processed.css'))
    .pipe(gulp.dest('./src'));
});

gulp.task('unusedCss', function () {
  return gulp
    .src(['./dist/bundle.css', './dist/index.html'])
    .pipe(checkCSS());
});

gulp.task('clean', function () {
  console.log('running clean');
  return del(['./dist/bundle.css']);
});


gulp.task('concat', ['css'], function () {
  return gulp.src(['./src/normalize.css', './src/processed.css'])
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload())
});

//gulp.task('build', ['css', 'concat']);

//Watch task
gulp.task('watch', ['express'], function () {
  livereload.listen();
  gulp.watch(['./src/*.{html,css}', './dist/index.html'], ['concat']);
});

