const path = require('path');
const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('pipe-scss', function () {
    return gulp
        .src(`./src/**/*.scss`)

        .pipe(
            rename(function (file) {
                const temp = path.dirname(file.dirname);
            })
        )

        .pipe(gulp.dest('lib'));
});
