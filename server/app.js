var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
let fs = require('fs'); // 访问静态文件

var app = express();

// 加入mongo
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./setting.js');

//JSON处理
var bodyParser = require('body-parser');

// 加入接口处理文件
var article = require('./routes/articles');

//设置跨域访问--start
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080")
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type")
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8")
  next()
})
//设置跨域访问--end

// 访问静态文件--start
app.use(express.static(path.join(__dirname, './public')))
app.all('/', function(req, res){
  console.log("=======================================")
  console.log("请求路径："+req.url)
  var filename = req.url.split('/')[req.url.split('/').length-1]
  var suffix = req.url.split('.')[req.url.split('.').length-1]
  console.log("文件名：", filename)
  if(req.url==='/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(get_file_content(path.join(__dirname, 'html', 'index.html')))
  }else if(suffix==='css'){
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end(get_file_content(path.join(__dirname, 'public', 'css', filename)))
  }else if(suffix in ['gif', 'jpeg', 'jpg', 'png','txt']) {
    res.writeHead(200, {'Content-Type': 'image/'+suffix});
    res.end(get_file_content(path.join(__dirname, 'public', 'images', filename)))
  }
})
function get_file_content(filepath){
  return fs.readFileSync(filepath)
}
// 访问静态文件--end
//
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.engine('.html', ejs.__express)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(settings.cookieSecret))

// 设置session
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  store: new MongoStore({db: settings.db}),
  resave: false,
  saveUninitialized: true
}))
app.use('/article', article)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
