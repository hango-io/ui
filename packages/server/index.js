'use strict';

module.exports = app => {

    // 配置插件 plugin
    app.$dispatcher('plugin', require.resolve('@/plugin'));
    // 配置中间件 middleware
    app.$dispatcher('middleware', require.resolve('@/middleware'));
    // 配置路由 router
    app.$dispatcher('router', require.resolve('@/route'));

};
