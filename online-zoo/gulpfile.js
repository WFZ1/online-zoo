const gulp = require('gulp'),
      sass = require('gulp-sass'),
      watch = require('gulp-watch'),
      webp = require('gulp-webp'),
      cleanCSS = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      sourcemaps = require('gulp-sourcemaps'),
      imagemin = require('gulp-imagemin');

const pages = [
        'landing',
        'zoos',
        'map'
      ],
      images_folders = [
        'how-it-works',
        'animals',
        'popup',
        'testimonials',
        'hero'
      ],
      icons_folders = [
        'inspiration-mission-belief',
        'map',
        'pay-and-feed',
        'social-media',
        'testimonials'
      ];

/**
 * ----------------------------------------------------------------------------
 *  COPY
 * ----------------------------------------------------------------------------
 */

gulp.task('copy', () => {
  let stream;
  
  pages.forEach(page => {
    // Normalize.css
    gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest(`pages/${ page }/css`));

    // Lazysizes
    stream = gulp.src('node_modules/lazysizes/lazysizes.min.js')
                 .pipe(gulp.dest(`pages/${ page }/js`));
  });

  return stream;
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
  let stream;

  pages.forEach(page => {
    stream = gulp.src(`pages/${ page }/scss/style.scss`)
                 .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
                 .pipe(gulp.dest(`pages/${ page }/css`));
  });

  return stream;
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
  let stream;

  pages.forEach(page => {
    stream = gulp.src(`pages/${ page }/style.css`)
                 .pipe(sourcemaps.init())
                 .pipe(cleanCSS())
                 .pipe(rename({ suffix: '.min' }))
                 .pipe(sourcemaps.write())
                 .pipe(gulp.dest(`pages/${ page }/css`));
  });

  return stream;
});

/**
 * ----------------------------------------------------------------------------
 *  IMAGES
 * ----------------------------------------------------------------------------
 */

/* MINIFY ================================================================================ */

gulp.task('image', () => {
  let stream;
  
  images_folders.forEach(folder => {
    stream = gulp.src(`assets/images/${ folder }/original/*.{jpg,png}`)
                 .pipe(imagemin())
                 .pipe(gulp.dest(`assets/images/${ folder }`));
  });

  return stream;
});

gulp.task('icon', () => {
  let stream;

  icons_folders.forEach(folder => {
    stream = gulp.src(`assets/icons/${ folder }/original/*`)
                 .pipe(imagemin())
                 .pipe(gulp.dest(`assets/icons/${ folder }`));
  });

  return stream;
});

/* CONVERT TO WEBP ================================================================================ */

gulp.task('webp', () => {
  let stream;

  images_folders.forEach(folder => {
    stream = gulp.src(`assets/images/${ folder }/original/*.{jpg,png}`)
                 .pipe(webp())
                 .pipe(gulp.dest(`assets/images/${ folder }`));
  });

  return stream;
});