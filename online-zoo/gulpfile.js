const gulp = require('gulp'),
      sass = require('gulp-sass'),
      watch = require('gulp-watch'),
      webp = require('gulp-webp'),
      cleanCSS = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      sourcemaps = require('gulp-sourcemaps'),
      imagemin = require('gulp-imagemin');

const pages = ['landing', 'zoos', 'map'],
      pages_count = pages.length,
      images_folders = ['how-it-works', 'animals', 'popup', 'testimonials', 'hero'],
      icons_folders = ['inspiration-mission-belief', 'map', 'pay-and-feed', 'social-media', 'testimonials'];

/**
 * ----------------------------------------------------------------------------
 *  COPY
 * ----------------------------------------------------------------------------
 */

gulp.task('copy', () => {
  for (let i = 0; i < pages_count; i++) {
    // Normalize.css
    gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest(`pages/${ pages[i] }/css`));

    // Lazysizes
    gulp.src('node_modules/lazysizes/lazysizes.min.js')
        .pipe(gulp.dest(`pages/${ pages[i] }/js`));
  }
});

/**
 * ----------------------------------------------------------------------------
 *  SASS AND CSS
 * ----------------------------------------------------------------------------
 */

/* Compile Sass file
 * Determines the output format of the final CSS style - { outputStyle: 'expanded' }
 ================================================================================ */

gulp.task('sass', () => {
  for (let i = 0; i < pages_count; i++) {
    gulp.src(`pages/${ pages[i] }/scss/style.scss`)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(`pages/${ pages[i] }/css`));
  }
});

/* WATCH ================================================================================ */

gulp.task('watch', () => {
  return gulp.watch('pages/**/scss/*.scss', gulp.series(['sass']));
});

/* Minify CSS
 * Rename file
 * Generate Source Maps
 ================================================================================ */

gulp.task('minify-css', () => {
  for (let i = 0; i < pages_count; i++) {
    gulp.src(`pages/${ pages[i] }/style.css`)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`pages/${ pages[i] }/css`));
  }
});

/**
 * ----------------------------------------------------------------------------
 *  IMAGES
 * ----------------------------------------------------------------------------
 */

/* MINIFY ================================================================================ */

gulp.task('image', () => {
  for (let i = 0; i < images_folders.length; i++) {
    gulp.src(`assets/images/${ images_folders[i] }/original/*.{jpg,png}`)
        .pipe(imagemin())
        .pipe(gulp.dest(`assets/images/${ images_folders[i] }`));
  }
});

gulp.task('icon', () => {
  for (let i = 0; i < icons_folders.length; i++) {
    gulp.src(`assets/icons/${ icons_folders[i] }/original/*`)
        .pipe(imagemin())
        .pipe(gulp.dest(`assets/icons/${ icons_folders[i] }`));
  }
});

/* CONVERT TO WEBP ================================================================================ */

gulp.task('webp', () => {
  for (let i = 0; i < images_folders.length; i++) {
    gulp.src(`assets/images/${ images_folders[i] }/original/*.{jpg,png}`)
      .pipe(webp())
      .pipe(gulp.dest(`assets/images/${ images_folders[i] }`));
  }
});