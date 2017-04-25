// generated on 2017-02-04 using generator-webapp 2.4.0

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const path = require('path');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const pug = require('gulp-pug');
const mozjpeg = require('imagemin-mozjpeg');

var dev = false;

const svgSymbols = require('gulp-svg-symbols');

// Png Sprites
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
// postCss
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');

// Postcss plugins
const plugins = [
  mqpacker({
    sort: true
  }),
  autoprefixer({browsers: ['> 5%', 'last 2 versions', 'Firefox ESR']})
]

gulp.task('templates', () => {
  return gulp.src('app/templates/*.pug')
  .pipe($.plumber())
  .pipe( pug({
    pretty: true
  }) )
  .pipe(gulp.dest('app'))
  .pipe(reload({stream: true}));
});

gulp.task('styles', () => {
  return gulp.src('app/sass/*.sass')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: [
        path.join(__dirname, 'node_modules')
      ]
    }).on('error', $.sass.logError))
    .pipe(postcss( plugins ))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('app/styles/'))
    // .pipe(gulp.dest('dist/styles/'))
    .pipe(reload({stream: true}));
});

gulp.task('styles-dist', () => {
  return gulp.src('app/styles/*.css')
  .pipe(gulp.dest('dist/styles/'));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('svg-sprite', () => {
  return gulp.src('app/images/svg/*.svg')
    .pipe( svgSymbols({
      templates: [
        ['default-svg']
      ]
    }) )
    .pipe( gulp.dest('app/images/') );
});

gulp.task('lint', () => {
  return lint('app/scripts/*.js')
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['app', '.']}))
    // .pipe($.if('/\.js$/', $.uglify({compress: {drop_console: true}})))
    // .pipe($.if('/\.css$/b', $.cssnano({safe: true, autoprefixer: false})))
    // .pipe($.if('/\.html$/', $.htmlmin({
    //   collapseWhitespace: true,
    //   minifyCSS: true,
    //   minifyJS: {compress: {drop_console: true}},
    //   processConditionalComments: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true,
    //   removeScriptTypeAttributes: true,
    //   removeStyleLinkTypeAttributes: true
    // })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin(
        [$.imagemin.gifsicle(),
          mozjpeg({ quality: 100 }),
          $.imagemin.optipng(),
          $.imagemin.svgo()],
        { verbose: true }
      ))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('sprites', () => {
    var spriteData = gulp.src('app/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprites.png',
        cssName: 'sprites.sass',
        imgPath: '../images/sprite/sprites.png',
        padding: 5
    }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('app/images/sprite/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('app/sass/helpers/'));

    return merge(imgStream, cssStream);
})

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html',
    '!app/sass/',
    '!app/templates/',
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['templates', 'styles', 'scripts', 'fonts'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      // 'app/*.html',
      'app/images/**/*',
      '.tmp/fonts/**/*',
    ]).on('change', reload);

    gulp.watch('app/templates/**/*.pug', ['templates']);
    gulp.watch('app/sass/**/*.sass', ['styles']);
    gulp.watch('app/scripts/*.js', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['templates', 'html', 'svg-sprite' ,'images', 'sprites', 'styles-dist', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'build', resolve);
  });
});
