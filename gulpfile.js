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

//cd C:\javaTools\wls12212\oracle_common\plugins\maven\com\oracle\maven\oracle-maven-sync\12.2.1
//mvn install:install-file-DpomFile=oracle-maven-sync-12.2.1 -Dfile=oracle-maven-sync-12.2.1.jar
gulp.task("compile",[], function () {
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