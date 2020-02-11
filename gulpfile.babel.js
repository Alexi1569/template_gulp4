const gulp = require('gulp'),
  scss = require('gulp-sass'),
  browsersync = require('browser-sync'),
  cache = require('gulp-cache'),
  uglify = require('gulp-uglify'),
  debug = require('gulp-debug'),
  pug = require('gulp-pug'),
  sourcemaps = require('gulp-sourcemaps'),
  cssimport = require('gulp-cssimport'),
  htmlBeautify = require('gulp-html-beautify'),
  imageminWebp = require('imagemin-webp'),
  webp = require('gulp-webp'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  mincss = require('gulp-clean-css'),
  favicons = require('gulp-favicons'),
  gulpif = require('gulp-if'),
  copy = require('gulp-copy'),
  yargs = require('yargs'),
  imageminPngquant = require('imagemin-pngquant'),
  imageminZopfli = require('imagemin-zopfli'),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  imageminGiflossy = require('imagemin-giflossy'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  groupmedia = require('gulp-group-css-media-queries'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  argv = yargs.argv,
  production = !!argv.production,
  webpackConfig = require('./webpack.config.js');

webpackConfig.mode = production ? 'production' : 'development';
webpackConfig.devtool = production ? false : 'source-map';

const paths = {
  views: {
    src: ['./app/modules/pages/**/*.pug'],
    dist: './dist/',
    watch: ['./app/modules/blocks/**/*.pug', './app/modules/pages/**/*.pug']
  },
  styles: {
    src: ['./app/scss/main.{scss,sass}'],
    dist: './dist/css',
    watch: [
      './app/blocks/**/*.{scss,sass}',
      './app/modules/**/*.{scss,sass}',
      './app/scss/**/*.{scss,sass}'
    ]
  },
  scripts: {
    src: './app/js/app.js',
    dist: './dist/js/',
    watch: './app/js/app.js'
  },
  images: {
    src: [
      './app/images/**/*.{jpg,jpeg,png,gif,tiff,svg}',
      '!app/images/favicon/*.{jpg,jpeg,png,gif,tiff}'
    ],
    dist: './dist/images/',
    watch: './app/images/**/*.{jpg,jpeg,png,gif,svg}'
  },
  webp: {
    src: [
      './app/images/**/*.{jpg,jpeg,png,tiff}',
      '!app/images/favicon/*.{jpg,jpeg,png,gif}'
    ],
    dist: './dist/images/',
    watch: [
      './app/images/**/*.{jpg,jpeg,png,tiff}',
      '!app/images/favicon.{jpg,jpeg,png,gif}'
    ]
  },
  fonts: {
    src: './app/fonts/**/*.{woff,woff2}',
    dist: './dist/fonts/',
    watch: './app/fonts/**/*.{woff,woff2}'
  },
  favicons: {
    src: './app/images/favicon/*.{jpg,jpeg,png,gif,tiff}',
    dist: './dist/images/favicons/'
  },
  gzip: {
    src: './app/.htaccess',
    dist: './dist/'
  },
  files: {
    src: ['./app/libs/jquery-3.3.1.min.js'],
    dist: './dist/js/'
  }
};

gulp.task('clear', done => {
  cache.clearAll();
  done();
});

gulp.task('clean', done => {
  return del(['./dist/*']);
  done();
});

gulp.task('copy', done => {
  return gulp.src(paths.files.src).pipe(gulp.dest(paths.files.dist));
  done();
});

gulp.task('favicons', done => {
  return gulp
    .src(paths.favicons.src)
    .pipe(
      favicons({
        icons: {
          appleIcon: true,
          favicons: true,
          online: false,
          appleStartup: false,
          android: false,
          firefox: false,
          yandex: false,
          windows: false,
          coast: false
        }
      })
    )
    .pipe(gulp.dest(paths.favicons.dist))
    .pipe(
      debug({
        title: 'Favicons'
      })
    );
  done();
});

gulp.task('fonts', done => {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dist))
    .pipe(
      debug({
        title: 'Fonts'
      })
    );
  done();
});

gulp.task('gzip', done => {
  return gulp
    .src(paths.gzip.src)
    .pipe(gulp.dest(paths.gzip.dist))
    .pipe(
      debug({
        title: 'GZIP config'
      })
    );
  done();
});

gulp.task('images', done => {
  return gulp
    .src(paths.images.src)
    .pipe(
      gulpif(
        production,
        imagemin([
          imageminGiflossy({
            optimizationLevel: 3,
            optimize: 3,
            lossy: 2
          }),
          imageminPngquant({
            speed: 5,
            quality: [0.6, 0.8]
          }),
          imageminZopfli({
            more: true
          }),
          imageminMozjpeg({
            progressive: true,
            quality: 90
          }),
          imagemin.svgo({
            plugins: [
              { removeViewBox: false },
              { removeUnusedNS: false },
              { removeUselessStrokeAndFill: false },
              { cleanupIDs: false },
              { removeComments: true },
              { removeEmptyAttrs: true },
              { removeEmptyText: true },
              { collapseGroups: true }
            ]
          })
        ])
      )
    )
    .pipe(gulp.dest(paths.images.dist))
    .pipe(
      debug({
        title: 'Images'
      })
    )
    .on('end', browsersync.reload);
  done();
});

gulp.task('scripts', done => {
  return gulp
    .src(paths.scripts.src)
    .pipe(
      webpackStream(webpackConfig),
      webpack
    )
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(
      debug({
        title: 'JS files'
      })
    )
    .on('end', browsersync.reload);
  done();
});

gulp.task('server', done => {
  browsersync.init({
    server: './dist/',
    port: 3000,
    notify: true
  });

  gulp.watch(paths.views.watch, gulp.parallel('pug'));
  gulp.watch(paths.styles.watch, gulp.parallel('styles'));
  gulp.watch(paths.scripts.watch, gulp.parallel('scripts'));
  gulp.watch(paths.images.watch, gulp.parallel('images'));
  gulp.watch(paths.webp.watch, gulp.parallel('webp'));
  gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
});

gulp.task('styles', done => {
  return gulp
    .src(paths.styles.src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(plumber())
    .pipe(
      scss({
        includePaths: ['node_modules']
      })
    )
    .pipe(cssimport({ includePaths: ['node_modules'] }))
    .pipe(groupmedia())
    .pipe(
      gulpif(
        production,
        autoprefixer({
          cascade: false,
          grid: true
        })
      )
    )
    .pipe(
      gulpif(
        production,
        mincss({
          compatibility: 'ie8',
          level: {
            1: {
              specialComments: 0,
              removeEmpty: true,
              removeWhitespace: true
            },
            2: {
              mergeMedia: true,
              removeEmpty: true,
              removeDuplicateFontRules: true,
              removeDuplicateMediaBlocks: true,
              removeDuplicateRules: true,
              removeUnusedAtRules: false
            }
          }
        })
      )
    )
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(plumber.stop())
    .pipe(gulpif(!production, sourcemaps.write('./maps/')))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(
      debug({
        title: 'CSS files'
      })
    )
    .pipe(browsersync.stream());
  done();
});

gulp.task('pug', done => {
  return gulp
    .src(paths.views.src)
    .pipe(pug())
    .pipe(
      htmlBeautify({
        indentSize: 2
      })
    )
    .pipe(gulpif(production, replace('.css', '.min.css')))
    .pipe(gulpif(production, replace('.js', '.min.js')))
    .pipe(gulp.dest(paths.views.dist))
    .pipe(browsersync.stream());
  done();
});

gulp.task('webp', done => {
  return gulp
    .src(paths.webp.src)
    .pipe(
      webp(
        gulpif(
          production,
          imageminWebp({
            lossless: true,
            quality: 100,
            alphaQuality: 100
          })
        )
      )
    )
    .pipe(gulp.dest(paths.webp.dist))
    .pipe(
      debug({
        title: 'Images'
      })
    )
    .on('end', browsersync.reload);
  done();
});

export const development = gulp.series(
  'clear',
  'clean',
  'copy',
  gulp.parallel([
    'pug',
    'styles',
    'scripts',
    'images',
    'webp',
    'fonts'
    // 'favicons'
  ]),
  gulp.parallel('server')
);

export const prod = gulp.series(
  'clean',
  'copy',
  gulp.series([
    'pug',
    'styles',
    'scripts',
    'images',
    'webp',
    'fonts',
    'favicons',
    'gzip'
  ])
);

export default development;
