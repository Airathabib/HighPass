const { src, dest, series,parallel, watch} = require('gulp');
const autoprefixes = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const cleanCss = require('gulp-clean-css');
const svgSprite = require("gulp-svg-sprite");
const image = require("gulp-image");
const babel = require('gulp-babel');
const notify  = require('gulp-notify');
const uglify = require('gulp-uglify-es').default
const sourcemaps = require('gulp-sourcemaps')
const del = require('del');
const webp = require('gulp-webp');
const gulpIf = require('gulp-if');
const sass = require('gulp-sass')(require('sass'));
const browsersync = require('browser-sync').create()


let isBuildFlag = false;

const clean = () => {
	return del(['dist'])
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./dist'))
}

const styles = () => {
	return src('src/css/**/*.scss')
	.pipe(gulpIf(!isBuildFlag, sourcemaps.init()))
	.pipe(sass({
		outputStyle: 'expanded'
	}).on('error', notify.onError())
	)
	.pipe(gulpIf(isBuildFlag, autoprefixes({
		browsers: ['last 5 versions'],
		cascade: false
	})))
	.pipe(gulpIf(isBuildFlag, (cleanCss({
		level: 2
	}))))
	.pipe(gulpIf(!isBuildFlag, sourcemaps.write()))
	.pipe(dest('dist'))
	.pipe(browsersync.stream())
}

const htmlminify = () => {
	return src('src/**/*.html')
	.pipe(gulpIf(isBuildFlag, htmlMin({
		collapseWhitespace: true,
	})))
	.pipe(dest('dist'))
	.pipe(browsersync.stream())
}

const svgSprites = () => {
	return src('src/img/svg/**/*.svg')
	.pipe(svgSprite({
		mode: {
			stack: {
				sprite: '../sprite.svg'
			}
		}
	}))
	.pipe(dest('dist/image'))
}

const scripts = () => {
	return src([
		'src/js/script.js'
	])
	.pipe(gulpIf(!isBuildFlag, sourcemaps.init()))
	.pipe(babel({
		presets: ['@babel/env']
}))
	.pipe(concat('app.js'))
	.pipe(gulpIf(isBuildFlag, uglify({
		toplevel: true
	}).on('error', notify.onError())))
	.pipe(gulpIf(!isBuildFlag, sourcemaps.write() ))
	.pipe(dest('dist'))
	.pipe(browsersync.stream())
}

const images = () => {
	return src([
		'src/img/**/*.jpg',
		'src/img/**/*.png',
		'src/img/*.svg',
		'src/img/**/*.jpeg',
	])
	.pipe(
		webp({
			quality: 75
		})
	)
	.pipe(dest('dist/image'))
	.pipe(image())
	.pipe(dest('dist/image'))
	.pipe(browsersync.stream())
}

function setMode (isBuild) {
	return cb => {
		isBuildFlag = isBuild;
		cb()
	}
}

const watchfiles = () => {
	browsersync.init({
		server: {
			baseDir: 'dist'
		}
	})
}


watch('src/**/*.html', htmlminify)
watch('src/css/**/*.scss', styles)
watch('./src/img/*.{jpg,jpeg,png,svg}', images);
watch('src/img/svg/**/*.svg', svgSprites)	
watch('src/js/**/*.js', scripts)
watch('./src/resources/**', resources);
watch('./src/img/**/*.{jpg,jpeg,png}', images);

exports.styles = styles
exports.scripts = scripts
exports.htmlminify = htmlminify 

const dev = parallel(resources, images, htmlminify, styles,	scripts,	svgSprites, )

exports.default = series(clean, dev, watchfiles)

exports.build = series(clean, setMode(true), dev,)