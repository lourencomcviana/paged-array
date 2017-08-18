var gulp = require("gulp");
var rimraf = require('gulp-rimraf');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');

var gulpConfig={
    destDir:tsProject.options.outDir
}

gulp.task('clean', function () {
 
    return gulp.src(gulpConfig.destDir, {read: false})
        .pipe(rimraf());
});

gulp.task("compile",['clean'], function () {

    var tsResult= tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    
    ;
    
    return tsResult.js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(gulpConfig.destDir))
        ;
});