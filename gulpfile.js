const gulp = require("gulp");
const rimraf = require('gulp-rimraf');
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const jasmine = require('gulp-jasmine');


const tsProject = ts.createProject("tsconfig.json");

var gulpConfig={
    destDir:tsProject.options.outDir,
    specFolder:'spec/**/*.js'
}

gulp.task('clean', function () {

    return gulp.src(gulpConfig.destDir, {read: false})
        .pipe(rimraf());
});

gulp.task("compile",['clean'], function () {
    return   tsProject.src()
      .pipe(sourcemaps.init())
      .pipe(tsProject()).js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(gulpConfig.destDir))
        ;
});

gulp.task("test",["compile"], function () {
    gulp.src(gulpConfig.specFolder)
    // gulp-jasmine works on filepaths so you can't have any plugins before it 
    .pipe(jasmine());  
});