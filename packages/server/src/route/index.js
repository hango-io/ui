'use strict';

const koaBody = require('koa-body');

module.exports = app => {

    // 内部接口
    app.useRoute('/inner/api', koaBody(), require('./inner')(app));

    // gportal
    app.useRoute('/proxy/api', require('./proxy')(app));

};
