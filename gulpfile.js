var gulp 			= require('gulp');
var sass 			= require('gulp-sass');
var autoprefixer 	= require('gulp-autoprefixer');
var gcmq 			= require('gulp-group-css-media-queries');
var pug 			= require('gulp-pug');
var browserSync 	= require('browser-sync');
var imagemin		= require('gulp-imagemin');
var concat			= require('gulp-concat');
var uglify 			= require('gulp-uglify');
var csso 			= require('gulp-csso');
var spritesmith		= require('gulp.spritesmith');


gulp.task('watch', ['pug', 'scss', 'imagemin', 'browser-sync'], function(){
	gulp.watch('./app/scss/**/*.scss', ['scss']);
	gulp.watch('./app/**/*.pug', ['pug']);
	gulp.watch('./public/js/*.js', browserSync.reload);
	//gulp.watch('./public/*.html', browserSync.reload);
});


gulp.task('pug', function(){
	return gulp.src('./app/index.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./public'))
		.pipe(browserSync.reload({
			stream: true
		}));
});


gulp.task('scss', function () {
	return gulp.src('./app/scss/**/*.scss')
	    .pipe(sass().on('error', sass.logError))
	    .pipe(gcmq())
	    .pipe(autoprefixer({
	        browsers: ['last 5 versions'],
	        cascade: true
	    }))
	    .pipe(gulp.dest('./public/css'))
	    .pipe(browserSync.reload({
			stream: true
		}));
});


gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: './public',
		},
		notify: false
	});
});


gulp.task('imagemin', function(){
	return gulp.src('./app/img/**/*')
		.pipe(imagemin({
			interlaced: true,
		    progressive: true,
		    optimizationLevel: 5,
		    svgoPlugins: [{removeViewBox: true}]
		}))
		.pipe(gulp.dest('./public/img'));
});


var icons = 'icons';
gulp.task('imagesprite', function () {
  return gulp.src('./app/img/' + icons + '/*.png')
  	.pipe(spritesmith({
  		algorithms: 'binary-tree',
	    imgName: icons + '.png',
	    cssFormat: 'css',
	    cssName: icons + '.css',
	    imgPath: '../img/' + icons + '.png',
	    padding: 10,
	  }))
	  .pipe(gulp.dest('./app/img/'));
});


gulp.task('jsmin', function() {
  	return gulp.src([
			'node_modules/slick-carousel/slick/slick.min.js',
			'node_modules/magnific-popup/public/jquery.magnific-popup.min.js'
		])
	    .pipe(concat('libs.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest('./public/js'));
});

gulp.task('cssmin', function() {
  	return gulp.src([
  			'node_modules/magnific-popup/public/magnific-popup.css'
  		])
	    .pipe(concat('libs.min.css'))
	    .pipe(csso())
	    .pipe(gulp.dest('./public/css'));
});






var smartgrid = require('smart-grid');
 
/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: "30px", /* gutter width px || % */
    container: {
        maxWidth: '1170px', /* max-width оn very large screen */
        fields: '15px' /* side fields */
    },
    breakPoints: {
        lg: {
            'width': '1100px', /* -> @media (max-width: 1100px) */
            'fields': '15px' /* side fields */
        },
        md: {
            'width': '960px',
            'fields': '15px'
        },
        sm: {
            'width': '780px',
            'fields': '15px'
        },
        xs: {
            'width': '560px',
            'fields': '15px'
        }
        /* 
        We can create any quantity of break points.
 
        some_name: {
            some_width: 'Npx',
            some_offset: 'N(px|%)'
        }
        */
    }
};

gulp.task('smartgrid', function() {
  return smartgrid('./app/scss', settings);
});