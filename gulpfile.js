const babel = require('gulp-babel');
const del = require('del');
const derequire = require('gulp-derequire');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const header = require('gulp-header');
const packageData = require('./package.json');
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');

const paths = {
  dist: 'dist',
  lib: 'lib',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
};

const COPYRIGHT_HEADER = `/**
 * react-geetest-captcha v<%= version %>
 *
 * MIT License
 *
 * Copyright (c) 2017 Mrhoho
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
`;

const babelOpts = {
  ignore: ['gt.js'],
  presets: [
    // A Babel preset that can automatically determine the Babel plugins and polyfills
    // https://github.com/babel/babel-preset-env
    [
      'env',
      {
        targets: {
          browsers: packageData.browserslist,
          uglify: true,
        },
        useBuiltIns: false,
        debug: false,
      },
    ],
    // Experimental ECMAScript proposals
    // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
    'stage-2',
    // JSX, Flow
    // https://github.com/babel/babel/tree/master/packages/babel-preset-react
    'react',
  ],
};

function buildDist(opts) {
  const webpackOpts = {
    output: {
      filename: opts.output,
      libraryTarget: 'umd',
      library: 'react-geetest-captcha',
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          opts.debug ? 'development' : 'production',
        ),
      }),
      new webpackStream.webpack.optimize.DedupePlugin(),
    ],
  };
  if (!opts.debug) {
    webpackOpts.plugins.push(
      new webpackStream.webpack.optimize.UglifyJsPlugin({
        compress: {
          hoist_vars: true,
          screw_ie8: true,
          warnings: false,
        },
      }),
    );
  }
  return webpackStream(webpackOpts, null, (err, stats) => {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', `\n${stats.toString({ colors: true })}`);
    }
  });
}

gulp.task('clean', () => del([paths.dist, paths.lib]));

gulp.task('modules', () =>
  gulp
    .src(paths.src)
    .pipe(babel(babelOpts))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib)),
);

gulp.task('dist', ['modules'], () => {
  const opts = {
    debug: true,
    output: 'react-geetest-captcha.js',
  };
  return gulp
    .src('./lib/index.js')
    .pipe(buildDist(opts))
    .pipe(derequire())
    .pipe(header(COPYRIGHT_HEADER, { version: packageData.version }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist:min', ['modules'], () => {
  const opts = {
    debug: false,
    output: 'react-geetest-captcha.min.js',
  };
  return gulp
    .src('./lib/index.js')
    .pipe(buildDist(opts))
    .pipe(header(COPYRIGHT_HEADER, { version: packageData.version }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', () => {
  gulp.watch(paths.src, ['modules']);
});

gulp.task('dev', () => {
  gulp.watch(paths.src, ['modules', 'dist']);
});

gulp.task('default', cb => {
  runSequence('clean', 'modules', ['dist', 'dist:min'], cb);
});
