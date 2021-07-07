'use strict';
const assert = require('assert');

module.exports = function(app) {
    assert.ok(app);

    app.use((ctx, next) => {
        if (!ctx._UncaughtExceptionStacks || !Array.isArray(ctx._UncaughtExceptionStacks)) {
            ctx._UncaughtExceptionStacks = [];
            ctx.addUncaughtExceptionStacks = err => {
                if (err.stack) {
                    err = err.stack;
                } else if (err.message) {
                    err = err.message;
                }
                ctx._UncaughtExceptionStacks.push(err);
            };
            ctx.getUncaughtExceptionStacks = () => {
                return ctx._UncaughtExceptionStacks;
            };
        }
        return next();
    });

    app.on('error', (error, ctx) => {
        ctx.addUncaughtExceptionStacks(error);
        const logger = ctx.logger || ctx.log || console;

        if (!ctx) {
            logger.error('触发了koa error 事件 [无ctx] message: %s error', error.message);
        } else {
            const otherInfo = `ctx.reqId: ${ctx.reqId} originalUrl: ${ctx.originalUrl}`;
            logger.error('触发了koa error 事件 message: %s ', `${error.message}, otherInfo: ${otherInfo}`);

            if (!ctx.respond) { // 恢复
                ctx.respond = true;
            }

            if (!ctx.body) {
                ctx.body = {
                    reqId: ctx.reqId,
                    error: ctx.message || 'koa error',
                    code: ctx.status || 500,
                    message: error.message,
                    stacks: ctx.getUncaughtExceptionStacks(),
                };
            }
        }
    });

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            ctx.addUncaughtExceptionStacks(error);

            const logger = ctx.logger || ctx.log || console;
            logger.error('接收到未捕获的错误信息 error: %o', error);

            if (!ctx.respond) { // 恢复
                ctx.respond = true;
            }

            // 全局捕获异常
            ctx.status = 500;
            let _body;
            if (ctx.body) {
                try {
                    _body = JSON.parse(JSON.stringify(ctx.body));
                } catch (e) {
                    // ignore
                }
            }
            ctx.body = {
                reqId: ctx.reqId,
                error: ctx.message || 'server error',
                result: _body, // 原旧数据
                code: 500,
                message: error.message,
                stacks: ctx.getUncaughtExceptionStacks(),
            };
        }
    });
};
