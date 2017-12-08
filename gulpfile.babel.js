import gulp from 'gulp'
import sass from 'gulp-ruby-sass' //Ruby sass
import autoprefixer from 'gulp-autoprefixer' //ベンダープレフィックス
import cmq from 'gulp-combine-media-queries' //メディアクエリの整理
import rename from 'gulp-rename' //ファイルのリネーム
import cssmin from 'gulp-cssmin' //css圧縮
import uglify from 'gulp-uglify' //js圧縮
import plumber from 'gulp-plumber' //エラーでgulpが終了するのを止める

import notify from 'gulp-notify'

import webpack from 'webpack-stream'
import eslint from 'gulp-eslint'
import webpackConfig from './webpack.config.js'

/*
 rootDir    : '対象のディレクトリ'
 serverDir  : 'サーバーのディレクトリ（ここではローカルなのでlocalhost）'
 */

const paths = {
    rootDir: 'C:/Users/anli/Documents/GitHub/markup',
    serverDir: 'localhost'
};

//other
// import paths = {
//   rootDir    : 'dev/lemonsha',
//   serverDir  : 'localhost'
// };

// sass compile
gulp.task('styles', function() {
    return sass(paths.rootDir + '/assets/sass/**/*.scss', {
            style: 'expanded',
        })
        .pipe(plumber({
            errorHandler: notify.onError('<%= error.message %>')
        }))
        .pipe(autoprefixer({
            browsers: ["last 4 versions", "ie >= 11", "Android >= 4", "iOS >= 8"]
        }))
        .pipe(cmq({
            log: true
        }))
        .pipe(gulp.dest(paths.rootDir + '/assets/css'))
        .pipe(notify('sass finished'));
});

// css-min
gulp.task('cssmin', ['styles'], function() {
    gulp.src(paths.rootDir + '/assets/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest(paths.rootDir + '/cssmin'))
        .pipe(notify('cssmin finished'));
});

gulp.task('build', function() {
    return gulp.src(paths.rootDir + '/assets/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.rootDir + '/src'))
        .pipe(notify('js build finished'));
});


//watch
gulp.task('watch', function() {
    gulp.watch(paths.rootDir + '/assets/sass/**/*.scss', function(event) {
        gulp.run('cssmin');
    });
    gulp.watch(paths.rootDir + '/assets/js/*.js', function(event) {
        gulp.run('build');
    });
});

//Default
gulp.task('default', ['watch']);
