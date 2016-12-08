var gulp         = require('gulp');
var sass         = require('gulp-sass');
var scsslint     = require('gulp-scss-lint')
var postcss      = require('gulp-postcss');
var cssnext      = require('postcss-cssnext');
var nano         = require('gulp-cssnano');
var shell        = require('gulp-shell');
var autoprefixer = require('gulp-autoprefixer');
var atImport     = require('postcss-import');
var cp           = require('child_process');
var browserSync  = require('browser-sync').create();
var deploy       = require('gulp-gh-pages');

var ignore = ['!_site', '!node_modules', '!.bundle', '!.publish']
var processors = [
  atImport,
  cssnext({
    'browsers': ['last 2 version'],
    'features': {
      'customProperties': {
        preserve: true,
        appendVariables: true
      },
      'colorFunction': true,
      'customSelectors': true,
      'sourcemap': true,
      'rem': false
    }
  })
];

// Compile SCSS into CSS & auto-inject into browsers
gulp.task('styles', function() {
  return gulp.src('./assets/styles/style.scss')
  .pipe(sass({includePaths: ['./assets/styles/']}))
  .pipe(nano({discardComments: {removeAll: true}}))
  .pipe(gulp.dest('./_site/assets/css'))
  .pipe(browserSync.stream());
});

// Compile SCSS into CSS & auto-inject into browsers
gulp.task('scripts', function() {
  return gulp.src('./assets/js/**.js')
  .pipe(gulp.dest('./_site/assets/js'))
  .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('./assets/images/**/*')
  .pipe(gulp.dest('./_site/assets/images'));
});

gulp.task('build-assets', ['styles', 'scripts', 'images']);
// Build once with only jekyll config
gulp.task('jekyll-build', ['build-assets'], shell.task(['bundle exec jekyll build --config _config.yml ']));
// Build incrementally with jekyl config + local config
gulp.task('local-build', ['build-assets'], shell.task(['bundle exec jekyll build --config _config.yml,local_config.yml ']));
// Reload browser on change. Used when running locally
gulp.task('reload', browserSync.reload);
// Static Server + watching scss/html files
gulp.task('serve', ['local-build'], function() {

    browserSync.init({
        server: { baseDir: '_site/' }
    });

    gulp.watch('assets/styles/**/*.scss', ['styles','reload']);
    gulp.watch(['**/*.svg'].concat(ignore), ['local-build','reload']);
    gulp.watch(['**/*.md'].concat(ignore), ['local-build','reload']);
    gulp.watch(['assets/js/**/*.js'].concat(ignore), ['scripts','reload']);
    gulp.watch(['**/*.html'].concat(ignore), ['local-build','reload']);
    gulp.watch(['**/*.yml'].concat(ignore), ['local-build','reload']);
});

// Deploy _site to gh-pages
gulp.task('deploy', ['jekyll-build'], function () {
  return gulp.src('./_site/**/*')
    .pipe(deploy())
});

// Gulp: Run styles, local-build, and serve
gulp.task('default', ['serve']);
