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
        proxyReq.setHeader('x-auth-projectId', '3');
        proxyReq.setHeader('x-auth-tenantId', '2');
        proxyReq.setHeader('x-auth-accountId', 'admin');
        proxyReq.setHeader('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50SWQiOiJhZG1pbiIsIlBlcm1pc3Npb25UeXBlIjoiZnVuY3Rpb24iLCJJZCI6IjEiLCJSRUdJU1RSQVRJT04iOiLns7vnu5_lr7zlhaUiLCJleHAiOjE2ODIzNjE1MTAsImlhdCI6MTY4MjMwMzkxMCwiRW52SW5mbyI6ImNvbnNvbGUudGVzdDI4My1xaW5nemhvdS5jb20ifQ.4Xp0mQ67rlS-sebhfvMJ9Bltrqbfr3aK0hJ3Fp2lfPM');
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
