var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var moment = require('moment');

var routes = require('./routes/index');
var links = require('./routes/links');
var login = require('./routes/login');
var repo = require('./models/links');

var app = express();

app.locals.moment = moment;

//Default Data:
repo.createNewLink("Beste Suchmaschine", "http://www.google.com", "hans", moment().subtract(7, "days").toDate() );
repo.createNewLink("Zweitbeste Suchmaschine", "http://www.bing.com", "martin", moment().subtract(6, "days").toDate() );
repo.createNewLink("Beste Hochschule", "http://www.hsr.ch", "fritz", moment().subtract(5, "days").toDate() );
repo.createNewLink("Node.js Website", "http://www.nodejs.org", "peter", moment().subtract(3, "days").toDate() );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session setup
app.use(session({
    secret: "hsrLinkIt",
    key: "sessionId",
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: true}
}));

app.use('/', routes);
app.use('/linkit', routes);
app.use('/links', links);
app.use('/login', login);

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
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
