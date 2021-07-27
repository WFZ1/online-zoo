const gulp = require('gulp'),
      sass = require('gulp-sass'),
      watch = require('gulp-watch'),
      webp = require('gulp-webp'),
      cleanCSS = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      sourcemaps = require('gulp-sourcemaps'),
      imagemin = require('gulp-imagemin'),
      responsive = require('gulp-responsive'),
      del = require('del');

const images_folders = [
        'how-it-works',
        'animals',
        'popup',
        'testimonials',
        'map',
        'hero'
      ],
      icons_folders = [
        'goals',
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
  // Normalize.css
  return gulp.src('node_modules/normalize.css/normalize.css')
             .pipe(gulp.dest('css'));
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
  return gulp.src('scss/pages/*.scss')
             .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
             .pipe(gulp.dest('css'));
});

/* WATCH ================================================================================ */

gulp.task('watch', () => {
  return gulp.watch('scss/**/*.scss', gulp.series(['sass']));
});

/* Minify CSS
 * Rename file
 * Generate Source Maps
 ================================================================================ */

gulp.task('minify-css', () => {  
  return gulp.src('css/*.css')
             .pipe(sourcemaps.init())
             .pipe(cleanCSS())
             .pipe(rename({ suffix: '.min' }))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('css'));
});

/**
 * ----------------------------------------------------------------------------
 *  IMAGES
 * ----------------------------------------------------------------------------
 */

/* MINIFY ================================================================================ */

gulp.task('images:minify', () => {
  let stream;
  
  images_folders.forEach(folder => {
    stream = gulp.src(`assets/images/${ folder }/original/*.{jpg,png}`)
                 .pipe(imagemin())
                 .pipe(gulp.dest(`assets/images/${ folder }`));
  });

  return stream;
});

gulp.task('icons:minify', () => {
  let stream;

  icons_folders.forEach(folder => {
    stream = gulp.src(`assets/icons/${ folder }/original/*`)
                 .pipe(imagemin())
                 .pipe(gulp.dest(`assets/icons/${ folder }`));
  });

  return stream;
});

/* CONVERT TO WEBP ================================================================================ */

gulp.task('images:webp', () => {
  let stream;

  images_folders.forEach(folder => {
    stream = gulp.src(`assets/images/${ folder }/original/*.{jpg,png}`)
                 .pipe(webp())
                 .pipe(gulp.dest(`assets/images/${ folder }`));
  });

  return stream;
});

/* GENERATE DIFFERENT IMAGES SIZES ================================================================================ */

const image_sizes = {
  hero: [
    { width: 320, rename: { suffix: '@xsm' }, withoutEnlargement: false },
    { width: 375, rename: { suffix: '@sm' }, withoutEnlargement: false },
    { width: 640, rename: { suffix: '@ph' }, withoutEnlargement: false },
    { width: 768, rename: { suffix: '@tb' }, withoutEnlargement: false },
    { width: 1024, rename: { suffix: '@lp' }, withoutEnlargement: false },
    { width: 1200, rename: { suffix: '@ds' }, withoutEnlargement: false },
    { width: 1440, rename: { suffix: '@ws' }, withoutEnlargement: false },
    { width: 1920, rename: { suffix: '@fhd' }, withoutEnlargement: false },
    { width: 2560, rename: { suffix: '@2k' }, withoutEnlargement: false }
  ],
  animals: [
    { width: 21, height: 21, rename: { suffix: '-21w21h' }, withoutEnlargement: false },
    { width: 43, height: 43, rename: { suffix: '-43w43h' }, withoutEnlargement: false },
    { width: 65, height: 65, rename: { suffix: '-65w65h' }, withoutEnlargement: false },
    { width: 75, height: 75, rename: { suffix: '-75w75h' }, withoutEnlargement: false },
    { width: 137, height: 137, rename: { suffix: '-137w137h' }, withoutEnlargement: false },
    { width: 140, rename: { suffix: '-140w' }, withoutEnlargement: false },
    { width: 140, height: 203, rename: { suffix: '-140w203h' }, withoutEnlargement: false },
    { width: 210, height: 301, rename: { suffix: '-210w301h' }, withoutEnlargement: false },
    { width: 245, rename: { suffix: '-245w' }, withoutEnlargement: false },
    { width: 245, height: 352, rename: { suffix: '-245w352h' }, withoutEnlargement: false },
    { width: 278, height: 399, rename: { suffix: '-278w399h' }, withoutEnlargement: false }
  ],
  'how-it-works': [
    { width: 300, rename: { suffix: '-300w' }, withoutEnlargement: false },
    { width: 600, rename: { suffix: '-600w' }, withoutEnlargement: false },
    { width: 746, rename: { suffix: '-746w' }, withoutEnlargement: false },
    { width: 790, rename: { suffix: '-790w' }, withoutEnlargement: false },
  ],
  testimonials: [
    { width: 68, height: 68, rename: { suffix: '-68w68h' }, withoutEnlargement: false }
  ],
  map: [
    { width: 320, rename: { suffix: '@xsm' }, withoutEnlargement: false },
    { width: 375, rename: { suffix: '@sm' }, withoutEnlargement: false },
    { width: 640, rename: { suffix: '@ph' }, withoutEnlargement: false },
    { width: 768, rename: { suffix: '@tb' }, withoutEnlargement: false },
    { width: 1024, rename: { suffix: '@lp' }, withoutEnlargement: false }
  ],
  popup: [
    { width: 320, rename: { suffix: '@xsm' }, withoutEnlargement: false },
    { width: 375, rename: { suffix: '@sm' }, withoutEnlargement: false },
    { width: 640, rename: { suffix: '@ph' }, withoutEnlargement: false },
    { width: 768, rename: { suffix: '@tb' }, withoutEnlargement: false },
    { width: 1024, rename: { suffix: '@lp' }, withoutEnlargement: false },
    { width: 1200, rename: { suffix: '@ds' }, withoutEnlargement: false },
    { width: 1440, rename: { suffix: '@ws' }, withoutEnlargement: false },
    { width: 1920, rename: { suffix: '@fhd' }, withoutEnlargement: false },
    { width: 2560, rename: { suffix: '@2k' }, withoutEnlargement: false }
  ]
};

gulp.task('images:resize', () => {
  let stream;

  images_folders.forEach(folder => {
    stream = gulp.src(`assets/images/${ folder }/*.{jpg,png}`)
                 .pipe(responsive({ '*.{jpg,png}': image_sizes[folder] }))
                 .pipe(gulp.dest(`assets/images/${ folder }`));
  });

  return stream;
});

/* DELETE IMAGES ================================================================================ */

const images_folders_str = '{' + images_folders.join(',') + '}';

gulp.task('images:clean', () => {
  return del([`assets/images/${ images_folders_str }/*.{jpg,png}`]);
});

/* COMMON CALL ================================================================================ */

gulp.task('images', gulp.series('images:clean', 'images:minify', 'images:resize'));