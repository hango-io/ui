'use strict';

const httpProxy = require('@2o3t/koa2-proxy-middleware');

module.exports = function(app) {
    const { options } = app.$config;
    const target = options.gportalUrl;

    const proxyOptions = {
        changeOrigin: true,
        target,
        pathRewrite: {
            '^/proxy/api/gportal': '', // rewrite path
        },
    };

    proxyOptions.onProxyReq = (proxyReq, req, res) => {
        proxyReq.setHeader('x-auth-projectId', '1');
        proxyReq.setHeader('x-auth-tenantId', '1');
    };

    proxyOptions.onError = (e, req, res) => {
        app.logger.error('代理出错，错误信息:', e);
        const result = {
            error: 'proxy error',
            status: e.code || 'error',
            code: 502,
            message: e.message,
            proxy: {
                target: req.url,
                ...e,
            },
            // stacks: ctx.getUncaughtExceptionStacks(),
        };
        res.statusCode = 502;
        res.statusMessage = e.errno || 'proxy error';
        const bodyData = JSON.stringify(result);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Length', Buffer.byteLength(bodyData));
        res.end(bodyData);
    };

    const router = app.$newRouter();
    router.all('/gportal(/?)(.*)', httpProxy(proxyOptions));

    return router;
};
