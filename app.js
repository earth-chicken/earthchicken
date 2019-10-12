var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var serviceRouter = require('./routes/service');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'l3wjP4ETau1qAx7L65Fo5Ve5NlFqW1of' +
          'HUYdMz4G/iaXsCM46qRUc35/ge4j7MNR' +
          'ACZzIUd0PUxkIIXqPDE96BhKGQyRyD+2' +
          'JrVXObpkSDAbXxKb5+OasWizDS3OhpHF', // 建议使用 128 个字符的随机字符串
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 900 * 1000 } // expire in 10 min
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/service', serviceRouter.router);
app.use('/users', usersRouter);

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
