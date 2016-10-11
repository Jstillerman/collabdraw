var gulp = require('gulp');
var webpack = require('gulp-webpack');
var exec = require('child_process').exec;



gulp.task('webpack', function() {
  exec('webpack app.js bundle.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('serve', function(){
  exec('node server.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('default', function(){

  gulp.run(['webpack', 'serve']);

  gulp.watch('app.js', function(event){
    gulp.run('webpack');
  });

  gulp.watch('server.js', function(event){
    gulp.run('serve');
  });


});
