var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'), 
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'), 
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'), 
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    coffee = require('gulp-coffee');

var generatedResourcesDirectory = 'dist/', 
    frontendSourcesDirectory = 'markup/';

gulp.task('compress-img', function() {
    gulp.src([frontendSourcesDirectory + 'modules/**/*.png',
                     frontendSourcesDirectory + 'modules/**/*.jpg',
                     frontendSourcesDirectory + 'modules/**/*.gif',
                     frontendSourcesDirectory + 'static/**/*.jpg',
                     frontendSourcesDirectory + 'static/**/*.png',
                     frontendSourcesDirectory + 'static/**/*.gif'])
    .pipe( imagemin({progressive: true}) )
    .pipe(gulp.dest(generatedResourcesDirectory + 'img'))
    .pipe(connect.reload());
});
gulp.task('build-html', function() {
    gulp.src([frontendSourcesDirectory + 'modules/**/*.jade', !frontendSourcesDirectory + 'modules/**/_*.jade'])
        .pipe(jade({pretty: true})).on('error', console.log)
        .pipe(gulp.dest(generatedResourcesDirectory + 'templates'));
    gulp.src(frontendSourcesDirectory + 'pages/**/*.jade')
        .pipe( jade({pretty: true}) ).on('error', console.log) 
        .pipe(gulp.dest(generatedResourcesDirectory + 'pages'))
        .pipe(connect.reload());
});
gulp.task('copy-fonts', function() {
    gulp.src([frontendSourcesDirectory + 'static/fonts/**/*.woff2',
              frontendSourcesDirectory + 'static/fonts/**/*.woff',
              frontendSourcesDirectory + 'static/fonts/**/*.ttf'])
        .pipe(gulp.dest(generatedResourcesDirectory + 'font'))
        .pipe(connect.reload());
});
gulp.task('dev-js', function() {
    gulp.src(frontendSourcesDirectory + 'modules/**/*.coffee')
        .pipe(coffee({bare: true}).on('error', console.log))
        .pipe(gulp.dest(generatedResourcesDirectory + "tempJs"));
    gulp.src(generatedResourcesDirectory + 'tempJs/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(generatedResourcesDirectory));
    gulp.src(frontendSourcesDirectory + 'static/vendor-js/**/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(generatedResourcesDirectory))
        .pipe(connect.reload());
});
gulp.task('dev-css', function() {
    gulp.src(frontendSourcesDirectory + 'modules/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(generatedResourcesDirectory + 'tempCss'));
    gulp.src(generatedResourcesDirectory + 'tempCss/**/*.css')
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(generatedResourcesDirectory));
    gulp.src(frontendSourcesDirectory + 'static/vendor-css/**/*.css')
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(generatedResourcesDirectory))
        .pipe(connect.reload());
});
gulp.task('dev', function(){
    gulp.run('compress-img');
    gulp.run('build-html');
    gulp.run('copy-fonts');
    gulp.run('dev-js');
    gulp.run('dev-css');
});
gulp.task('release', function(){
    gulp.run('dev');
    gulp.src(generatedResourcesDirectory + 'bundle.css', generatedResourcesDirectory + 'vendor.css')
        .pipe(minifycss());
    gulp.src(generatedResourcesDirectory + 'bundle.js', generatedResourcesDirectory + 'vendor.js')
        .pipe(uglify());
});
gulp.task('connect', function() {
    connect.server({
        root: generatedResourcesDirectory,
        port: 9007,
        livereload: true
    });
});
gulp.task('watch', function () {
    gulp.watch([frontendSourcesDirectory + '**/*'], ['dev']);
});
gulp.task('default', ['dev', 'connect', 'watch']);