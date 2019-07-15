var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require('jquery-file-upload-middleware');
var fs = require('fs');
var _ = require('lodash');
var gmagic = require('gm');
var gm = gmagic.subClass({imageMagick: true});
var url = require('url');
var session = require('express-session');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mypageRouter = require('./routes/mypage');
var introductionRouter = require('./routes/introduction');
var manualRouter = require('./routes/manual');
var serviceRouter = require('./routes/service');
var templateRouter = require('./routes/template');
var ontopingRouter = require('./routes/ontoping');

var app = express();

let models = require("./models/index.js");

models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");
  models.Tier.create({id: 1}).then( () => {
    models.Tier.create({id: 2});
    models.Tier.create({id: 3});
    models.Tier.create({id: 4});
  }).catch(err => {
    console.log("이미 존재합니다.");
  });

}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});

// view engine setup
app.set('views', __dirname + '/../dist');
app.set('view engine', 'ejs');

app.use(bodyParser.json({limit: '500mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

app.use(session({
  key: 'sid', // 세션의 키 값
  secret: 'secret', // 세선의 비밀 키, 쿠키 값의 변조를 막기 위해서 이 값을 통해 세선을 암호화하여 저장.
  resave: false, // 세션을 항상 저장할 지 여부.
  saveUninitialized: true, // 세션이 저장되기 전에 uninitialize 상태로 만들어 저장
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/templates', express.static(__dirname + '/../templates'));
app.use('/uploads', express.static(__dirname + '/../uploads'));
app.use(express.static(path.join(__dirname, '/../dist/public/')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mypage', mypageRouter);
app.use('/introduction', introductionRouter);
app.use('/manual', manualRouter);
app.use('/service', serviceRouter);
app.use('/template', templateRouter);
app.use('/ontoping', ontopingRouter);
app.use(require('connect-livereload')({ ignore: [/^\/dl/, /^\/img/] }));

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


//mosaico


var PORT = process.env.PORT || 3000;

var server = app.listen( PORT, function() {
    var check = gm(100, 100, '#000000');
    check.format(function (err, format) {
        if (err) console.error("ImageMagick failed to run self-check image format detection. Error:", err);
    });
    console.log('Express server listening on port ' + PORT);
} );

module.exports = app;
