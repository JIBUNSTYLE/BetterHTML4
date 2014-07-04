var gulp = require('gulp'), 
    rimraf = require('rimraf'), 
    watch = require('gulp-watch'), 
    uglify = require('gulp-uglify'), 
    concat = require('gulp-concat'),
    bower = require('gulp-bower-files'),
    flatten = require('gulp-flatten');

gulp.task('clean', function(cb){
    rimraf('dist/', cb);   
});

gulp.task('scripts', ['clean'], function(){
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));        
});

gulp.task('bower', function(){
    bower()
        .pipe(flatten())
        .pipe(gulp.dest('dist/js'));        
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'bower']);

