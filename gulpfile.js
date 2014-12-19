var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    eventStream = require('event-stream'),
    gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins({});
var pkg = require('./package.json');

var config = {
  main: '.',
  ts: ['plugins/**/*.ts'],
  exampleTs: 'example/**/*.ts',
  exampleTemplates: 'example/**/*.html',
  exampleTemplateModule: 'example-templates',
  templates: ['plugins/**/*.html'],
  templateModule: pkg.name + '-templates',
  dist: './dist/',
  js: pkg.name + '.js',
  exampleJs: 'example-plugins.js',
  tsProject: plugins.typescript.createProject({
    target: 'ES5',
    module: 'commonjs',
    declarationFiles: true,
    noExternalResolve: false
  }),
  exTsProject: plugins.typescript.createProject({
    target: 'ES5',
    module: 'commonjs',
    declarationFiles: true,
    noExternalResolve: false
  })
};

gulp.task('bower', function() {
  gulp.src('index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
});

gulp.task('tsc-example', function() {
  var tsResult = gulp.src(config.exampleTs)
    .pipe(plugins.typescript(config.exTsProject))
    .on('error', plugins.notify.onError({
      message: '<%= error.message %>',
      title: 'example plugin error'
    }));

    return tsResult.js
        .pipe(plugins.concat('ex-compiled.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('tsc', function() {
  var tsResult = gulp.src(config.ts)
    .pipe(plugins.typescript(config.tsProject))
    .on('error', plugins.notify.onError({
      message: '<%= error.message %>',
      title: 'main plugin error'
    }));

    return eventStream.merge(
      tsResult.js
        .pipe(plugins.concat('compiled.js'))
        .pipe(gulp.dest('.')),
      tsResult.dts
        .pipe(gulp.dest('d.ts')));
});

gulp.task('template-example', ['tsc-example'], function() {
  return gulp.src(config.exampleTemplates)
    .pipe(plugins.angularTemplatecache({
      filename: 'ex-templates.js',
      root: 'example/',
      standalone: true,
      module: config.exampleTemplateModule,
      templateFooter: '}]); hawtioPluginLoader.addModule("' + config.exampleTemplateModule + '");'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('template', ['tsc'], function() {
  return gulp.src(config.templates)
    .pipe(plugins.angularTemplatecache({
      filename: 'templates.js',
      root: 'plugins/',
      standalone: true,
      module: config.templateModule,
      templateFooter: '}]); hawtioPluginLoader.addModule("' + config.templateModule + '");'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('concat-example', ['template-example'], function() {
  return gulp.src(['ex-compiled.js', 'ex-templates.js'])
    .pipe(plugins.concat(config.exampleJs))
    .pipe(gulp.dest(config.dist));
});

gulp.task('concat', ['template'], function() {
  return gulp.src(['compiled.js', 'templates.js'])
    .pipe(plugins.concat(config.js))
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean-example', ['concat-example'], function() {
  return gulp.src(['ex-templates.js', 'ex-compiled.js'], { read: false })
    .pipe(plugins.clean());
});

gulp.task('clean', ['concat'], function() {
  return gulp.src(['templates.js', 'compiled.js'], { read: false })
    .pipe(plugins.clean());
});

gulp.task('watch', ['build', 'build-example'], function() {
  plugins.watch(['libs/**/*.js', 'libs/**/*.css', 'index.html', config.dist + '/' + config.js, config.dist + '/' + config.exampleJs], function() {
    gulp.start('reload');
  });
  plugins.watch(['libs/**/*.d.ts', config.ts, config.templates], function() {
    gulp.start('build');
  });
  plugins.watch(['libs/**/*.d.ts', config.exampleTs, config.exampleTemplates], function() {
    gulp.start('build-example');
  });
});

gulp.task('connect', ['watch'], function() {
  plugins.connect.server({
    root: '.',
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(plugins.connect.reload());
});

gulp.task('build', ['tsc', 'template', 'concat', 'clean']);
gulp.task('build-example', ['tsc-example', 'template-example', 'concat-example', 'clean-example']);

gulp.task('default', ['connect']);


    
