const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
  './src/css/normalize.css',
  './src/css/style.css'
];

const jsFiles = [
  './src/js/main.js'
];

const styles = () => {
  return gulp.src(cssFiles)
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
};

const fonts = () => {
  return gulp.src('./src/fonts/**/*.{woff,woff2}')
  .pipe(gulp.dest('./build/fonts'));
};

const scripts = () => {
  return gulp.src(jsFiles)
    .pipe(concat('index.js'))
    .pipe(uglify({
      toplevel: 3
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
};

const clean = () => {
  return del(['build/*']);
};

const watch = () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./src/css/**/*.css', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/*.html', browserSync.reload);
};

gulp.task('styles', styles);
gulp.task('fonts', fonts);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);

gulp.task('build', gulp.series(clean,
                                gulp.parallel(styles, fonts, scripts)));

gulp.task('dev', gulp.series('build', watch));
