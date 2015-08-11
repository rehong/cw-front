// routes.js - houjiazong, 2015/08/11
var router = require('koa-router')();
var config = require('config');
var render = require('./render');

module.exports = {
  dev: function() {
    router.get('/login_demo', function*() {
      this.body = yield render('login_demo', {
        API_PREFIX: config['API_PREFIX']
      });
    });
    return router;
  },
  pro: function() {
    // cms index
    router.get('/', function *() {
      this.body = yield render('index', {
        API_PREFIX: config['API_PREFIX'],
        LOGIN_URL: config['LOGIN_URL']
      });
    });
    // login
    router.get('/login', function *() {
      var url = config['LOGIN_URL'] + '?' + this.querystring;
      this.redirect(url);
    });
    // 装逼首页
    router.get('/index', function *() {
      this.body = yield render('dmc_index');
    });
    // 条款
    router.get('/license', function *() {
      this.body = yield render('license');
    });
    return router;
  }
};