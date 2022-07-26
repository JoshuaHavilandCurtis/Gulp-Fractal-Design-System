/* eslint-disable */
'use strict';

// ==== Dependencies ====================================
const autoprefixer = require('gulp-autoprefixer');
const bourbon = require('node-bourbon').includePaths;
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const watchify = require('watchify');
const assign = require('lodash.assign');
const log = require('gulplog');
const buffer = require('vinyl-buffer');
const terser = require('gulp-terser');

// ==== Fractal configuration
const fractal = require('./fractal.config.js');
const logger = fractal.cli.console;

// ==== Paths
const paths = {
  build: `./www`,
  dest: `./tmp`,
  src: `./src`,
  // umbraco: `../Constant Companion`,
  modules: `./node_modules`,
  dist: '../dist',
};

// ==== Vendor scripts to bundle
const pathsToVendorScripts = [];

// ==== TASKS ====================================

// Build static site
function buildFractal() {
  const builder = fractal.web.builder();

  builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
  builder.on('error', (err) => logger.error(err.message));

  return builder.start().then(() => {
    logger.success('Fractal build completed!');
  });
}

// ==== Serve dynamic site
function serveDev() {
  const server = fractal.web.server({
    sync: true,
    // syncOptions: {
    //   https: true
    // }
  });
  server.on('error', (err) => logger.error(err.message));
  return server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.url}`);
  });
}

// ==== Clean
function clean() {
  return del(`${paths.dest}/assets/`);
}

// ==== Compile scss to css
function styles() {
  logger.success('---------------COMPILING SCSS---------------');
  return gulp
    .src([`${paths.src}/assets/scss/main.scss`])
    .pipe(
      sass({
        outputStyle: 'expanded',
        sourceComments: 'map',
        sourceMap: 'scss',
        includePaths: bourbon,
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cssmin())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(`${paths.dest}/assets/css/`))
    .pipe(gulp.dest(`${paths.dist}/css/`));
}

const customOpts = {
  entries: [`${paths.src}/assets/js/main.ts`],
  debug: true,
};

const opts = assign({}, watchify.args, customOpts);
const b = watchify(
  browserify(opts)
    .plugin(tsify, { noImplicitAny: true })
    .transform('babelify', {
      presets: ['@babel/preset-typescript'],
      sourceMaps: false,
      global: true,
      ignore: [/\/node_modules\/(?!your module folder\/)/],
    })
);

// ==== Compile app js partials
function scriptsMainDev() {
  logger.success('---------------COMPILING APP.JS---------------');
  // return browserify(`${paths.src}/assets/js/main.ts`)
  //   .plugin(tsify, { noImplicitAny: true })
  //   .transform("babelify", {
  //     presets: ["@babel/preset-typescript"],
  //     sourceMaps: true,
  //     global: true,
  //     ignore: [/\/node_modules\/(?!your module folder\/)/]
  //   })
  //   .bundle()
  //   .pipe(source('app.js'))
  //   .pipe(gulp.dest(`${paths.dest}/assets/js/`))

  return b
    .bundle()
    .on('error', log.error.bind(log, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest(`${paths.dest}/assets/js/`))
    .pipe(gulp.dest(`${paths.dist}/js/`));
}

// ==== Compile app js partials
function scriptsMainBuild() {
  logger.success('---------------COMPILING APP.JS---------------');
  return browserify(`${paths.src}/assets/js/main.ts`)
    .plugin(tsify, { noImplicitAny: true })
    .transform('babelify', {
      presets: ['@babel/preset-typescript'],
      sourceMaps: false,
      global: true,
      ignore: [/\/node_modules\/(?!your module folder\/)/],
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest(`${paths.dest}/assets/js/`))
    .pipe(gulp.dest(`${paths.dist}/js/`));
}

// ==== Compile vendor js partials
function scriptsVendor() {
  logger.success('---------------COMPILING VENDOR.JS---------------');
  return gulp
    .src(pathsToVendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(uglify().on('error', console.error))
    .pipe(gulp.dest(`${paths.dest}/assets/js/`))
    .pipe(gulp.dest(`${paths.dist}/vendor/js/`));
}

// ==== Copy images for dev server
function copyImagesToDest() {
  logger.success(`---------------COPYING IMAGES TO ${paths.dest} ---------------`);
  return gulp
    .src([`${paths.src}/assets/img/*`, `${paths.src}/assets/img/**/*`])
    .pipe(gulp.dest(`${paths.dest}/assets/img/`))
    .pipe(gulp.dest(`${paths.dist}/assets/img/`));
}

// ==== Copy video for dev server
function copyVideosToDest() {
  logger.success(`---------------COPYING VIDEO TO ${paths.dest} ---------------`);
  return gulp
    .src([`${paths.src}/assets/video/*`, `${paths.src}/assets/video/**/*`])
    .pipe(gulp.dest(`${paths.dest}/assets/video/`))
    .pipe(gulp.dest(`${paths.dist}/assets/video/`));
}
// ==== Copy fonts for dev server
function copyFontsToDest() {
  logger.success(`---------------COPYING FONTS TO ${paths.dest} ---------------`);
  return gulp
    .src([`${paths.src}/assets/fonts/*`, `${paths.src}/assets/fonts/**/*`])
    .pipe(gulp.dest(`${paths.dest}/assets/fonts/`))
    .pipe(gulp.dest(`${paths.dist}/assets/fonts/`));
}

// ==== Copy meta assets for dev server
function copyMetaToDest() {
  logger.success(`---------------COPYING META TO ${paths.dest} ---------------`);
  return gulp
    .src([`${paths.src}/assets/meta/*`, `${paths.src}/assets/meta/**/*`])
    .pipe(gulp.dest(`${paths.dest}/assets/meta/`))
    .pipe(gulp.dest(`${paths.dist}/assets/meta/`));
}

// ==== Watch
function watch() {
  gulp.watch(`${paths.src}/assets/scss/**/*.scss`, styles);
  gulp.watch(`${paths.src}/assets/js/**/*.ts`, scriptsMainDev);
  gulp.watch([`${paths.src}/assets/img/*`, `${paths.src}/assets/img/**/*`], copyImagesToDest);
  gulp.watch([`${paths.src}/assets/fonts/*`, `${paths.src}/assets/fonts/**/*`], copyFontsToDest);
  gulp.watch([`${paths.src}/assets/meta/*`, `${paths.src}/assets/meta/**/*`], copyMetaToDest);

  // b.on('update', scriptsMainDev);
  b.on('log', log.info);
}

// ==== Run local server with build assets ready to export
function serveExport() {
  logger.success('---------------SERVING BUILD FILES---------------');
  browserSync.init({
    server: `${paths.build}/`,
  });
}

// ==== Copy ALL assets to design system build folder
function copyAssets() {
  logger.success(`---------------COPYING ASSETS TO ${paths.build} ---------------`);
  return gulp
    .src([`${paths.dest}/assets/*`, `${paths.dest}/assets/**/*`])
    .pipe(gulp.dest(`${paths.build}/assets/`))
    .on('end', function () {
      logger.success('\x1b[33m%s\x1b[0m', 'Run gulp start to test your build assets!');
    });
}

// ==== Copy ALL assets to umbraco build folder
// function copyAssetsToUmbraco() {
//   console.log(`---------------COPYING ASSETS TO ${paths.umbraco} ---------------`);
//   return gulp.src([`${paths.dest}/assets/*`, `${paths.dest}/assets/**/*`])
//     .pipe(gulp.dest(`${paths.umbraco}/assets/`))
//     .on('end', function () { console.log('\x1b[33m%s\x1b[0m', 'Run gulp start to test your build assets!'); });
// }

// ==== Task bundles ====================================
const compileDev = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scriptsMainDev,
    copyImagesToDest,
    copyVideosToDest,
    copyMetaToDest,
    copyFontsToDest
  )
);
const compileBuild = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scriptsMainBuild,
    copyImagesToDest,
    copyVideosToDest,
    copyMetaToDest,
    copyFontsToDest
  )
);

const compileDist = gulp.series(clean, gulp.parallel(styles, scriptsMainBuild));

// ==== Development
gulp.task('dev', gulp.series(serveDev, compileDev, watch));

// ==== Build fractal web UI and assets
gulp.task('build', gulp.series(compileBuild, buildFractal, copyAssets));

gulp.task('frontend', gulp.series(compileDist, watch));

// ==== Test fractal web UI and assets in local server
gulp.task('start', gulp.series(serveExport));
