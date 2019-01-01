var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var mongo = require('mongodb');
var ExpressValidator = require('express-validator');
var session = require('express-session');
var db = require('monk')('localhost/nodeblog');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var postRouter = require('./routes/posts');
var categoryRouter = require('./routes/categories');


var app = express();

app.locals.truncateText = function(text,length){
  var truncatedtext = Text.substring(0, length);
  return truncatedtext;
}
//app.use(multer({dest: './public/images/uploads'}));

app.use(session ({
    secret: 'secret',
    saveUninitialized: 'true',
    resave: 'true'
}));
app.locals.moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(multer({ 
  dest: './public/images/uploads'}).any());

app.use(ExpressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split(','),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/categories', categoryRouter);


app.use(function(req, res, next) {
  req.db = db;
  next();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
