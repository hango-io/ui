'use strict';

const path = require('path');
const koaStatic = require('koa-static');

module.exports = app => {
    const config = app.$config;

    const contentBase = path.resolve(config.root, './public');
    app.use(koaStatic(contentBase, {
        maxage: 1000 * 60 * 60 * 1, // 1h
    }));
};
