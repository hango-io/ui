'use strict';

module.exports = function(app) {
    const config = app.$config;
    const router = app.$newRouter();

    router.get('/health/status', (ctx, next) => {
        ctx.status = 200;
        ctx.body = {
            code: 200,
            result: 'online',
        };
    });

    router.get('/version', (ctx, next) => {
        ctx.status = 200;
        ctx.body = {
            code: 200,
            version: config.info.version,
            description: config.info.description,
        };
    });

    return router;
};
