var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userDataCard = require('./routes/userdatacard');
var userFamillyProgress = require('./routes/userfamillyprogress');
var userFriends = require('./routes/userfriends');
var userPlayHistory = require('./routes/userplayhistory');
var userStepperData = require('./routes/userstepperdata');
var communityChallenge = require('./routes/communityChallenge');
var communityEvent = require('./routes/communityEvent');
var communityGroup = require('./routes/communityGroup');
var progressPointData = require('./routes/progressPointData');
var rewardsData = require('./routes/rewardsData');

var app = express();

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/userdatacard', userDataCard);
app.use('/userfamillyprogress', userFamillyProgress);
app.use('/userfriends', userFriends);
app.use('/userplayhistory', userPlayHistory);
app.use('/userstepperdata', userStepperData);
app.use('/communitychallenge', communityChallenge);
app.use('/communityevent', communityEvent);
app.use('/communitygroup', communityGroup);
app.use('/progresspointdata', progressPointData);
app.use('/rewardsdata', rewardsData);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
