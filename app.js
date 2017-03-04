var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
//var routes = require('./routes/index');
var setting = require('./settings');
var routes = require('./routes');

var app = express();

//microblog part

//app.use(express.methodOverride());
app.use(session({
  secret:setting.cookieSecret,
  key:setting.db,
  cookie:{maxAge:1000*60*60*24*30},
  store:new MongoStore({
    // db: settings.db
    url:'mongodb://localhost/' + setting.db,
    autoRemove:'native'
  })
}));
//app.use(app.router);
//app.use(express.router(routes));
//microblog part
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/hello', index);
app.get('/list', function(req, res) {
  res.render('list', {
    title: 'List',
    items: [1991, 'byvoid', 'express', 'Node.js']
  });
});

// start microblog part
app.get('/u/:user',user);
app.post('/post',post);
app.get('/reg',reg);
app.post('/reg',doReg);
app.get('/login',login);
app.post('/login',doLogin);
app.get('/logout',logout);

// end microblog part
app.use(flash());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(req,res,next){
  res.locals.user=req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;

  next();
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