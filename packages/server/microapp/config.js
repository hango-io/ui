'use strict';

module.exports = {
    namespace: '@',
    alias: {
        root: './',
        src: './src',
        plugin: './src/plugin',
        middleware: './src/middleware',
        route: './src/route',
        utils: './src/utils',
        controller: './src/controller',
    },
    server: {
        entry: 'index.js',
        // host: 'localhost',
        port: 8789,
        options: {
            // 配置参数 env
            gportalUrl: process.env.gportalUrl || 'http://163yun.com/product/api',
        },
    },
    plugins: [
        '@micro-app/plugin-koa',
    ],
};
