const gulp = require("gulp");
const { src, dest, watch, series, task } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync").create();

// Sass task

function scss() {
  return src("app/scss/**/*.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

// Javascript task

function js() {
  return src("app/js/**/*.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

// Browserync task

function browserSyncServe(done) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
    port: 3000,
  });
  done();
}

// Image task

function minifyImages() {
  return src("app/images/**/*.{jpg,jpeg,png,svg,gif}")
    .pipe(imagemin())
    .pipe(dest("dist/images"));
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch task

function watchTask() {
  watch("*.html", browserSyncReload);
  watch(
    [
      "app/scss/**/*.scss",
      "app/js/**/*.js",
      "app/images/**/*.{jpg,jpeg,png,svg,gif}",
    ],
    series(scss, js, minifyImages, browserSyncReload)
  );
}

// Default Gulp task

exports.default = series(scss, js, browserSyncServe, watchTask);
