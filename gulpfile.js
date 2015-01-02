// Gulp tasks

// Load plugins 
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload;


// Minify all css files in the css directory
// Run this in the root directory of the project with `gulp minify-css `
gulp.task('minify-css', function(){
  gulp.src('./css/style.css')
    .pipe(minifyCSS())
    .pipe(rename('style.min.css'))
    .pipe(size({gzip:true, showFiles: true}))
    .pipe(gulp.dest('./css/'));
});

gulp.task('minify-img', function(){
  gulp.src('./img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
    }))
    .pipe(gulp.dest('./img/'));
});

// Task that compiles scss files down to good old css
gulp.task('pre-process', function(){
  gulp.src('./sass/style.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass())
          .pipe(size({gzip: false, showFiles: true}))
          .pipe(size({gzip: true, showFiles: true}))
          .pipe(gulp.dest('css'))
          .pipe(minifyCSS())
          .pipe(rename('style.min.css'))
          .pipe(size({gzip: false, showFiles: true}))
          .pipe(size({gzip: true, showFiles: true}))
          .pipe(gulp.dest('./css/'))
          .pipe(browserSync.reload({stream:true}));
      }));
});

// Initialize browser-sync which starts a static server also allows for 
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./"
        }
    });
});

// Function to call for reloading browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/*
   DEFAULT TASK

 • Process sass then auto-prefixes and lints outputted css
 • Starts a server on port 3000
 • Reloads browsers when you change html or sass files

*/
gulp.task('default', ['pre-process', 'bs-reload', 'browser-sync'], function(){
  gulp.start('pre-process', 'minify-img');
  gulp.watch('sass/*.scss', ['pre-process']);
  gulp.watch('css/style.css', ['bs-reload']);
  gulp.watch('*.html', ['bs-reload']);
});

