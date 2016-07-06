var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');


require('./models/Users');
require('./models/Parks');
//passportjs configuration
require('./config/passport');

mongoose.connect('127.0.0.1:27017/doc');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());




//Initializing passportjs
app.use(passport.initialize());

app.use('/', routes);
//Passes all routing to Angular
app.all('/*', function(req, res, next){
  res.render('index.ejs');
});

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {

    if (err.name === 'UnauthorizedError') {
      //express-jwt user auth error
      res.status(401).json({message: 'Please log in to add items to your cart.'});
    }else{
      //default error
      res.status(err.status || 500);
    }
    
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //console.log('ERROR!!!');
  res.status(err.status || 500).json({message: 'Error!'});
});



module.exports = app;
