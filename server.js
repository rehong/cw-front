var koa = require('koa');
var views = require('co-views');
var _static = require('koa-static');
var route = require('koa-route');
var path = require('path');
var config = require('config');
var logger = require('koa-logger');
var _ = require('lodash');
var request = require('co-request');
var proxy = require('koa-proxy');

var app = koa();

var render = views(__dirname + '/views', {
  map: {
    html: 'swig'
  }
});

app.use(_static(path.join(__dirname, '/build'), {}));

if (app.env != 'production') {
  app.use(logger());
  app.use(proxy({
    host: config['PROXY_PREFIX'],
    match: /(^\/test\/|^\/api\/|^\/online)/
  }));
  app.use(route.get('/login_demo', function*() {
    this.body = yield render('login_demo', {
      API_PREFIX: config['API_PREFIX']
    });
  }));
}

app.use(route.get('/', function*() {
  this.body = yield render('index', {
    API_PREFIX: config['API_PREFIX'],
    LOGIN_URL: config['LOGIN_URL']
  });
}));

app.use(route.get('/login', function*() {
  var url = config['PROXY_PREFIX'] + this.path + '?' + this.querystring;
  this.redirect(url);
}));

// 临时
app.use(route.get('/index', function*() {
  this.body = yield render('dmc_index');
}));

app.listen(process.env.PORT || 9000, function() {
  console.log('listening on port 9000');
  process.send && process.send('online');
});
