'use strict';

const assert = require('assert');
const LRU = require('lru-cache');

module.exports = function cache(app) {
    assert.ok(app);
    const options = {
        max: 500,
        maxAge: 1000 * 60 * 5, // 5min
    };
    app.context.cache = new LRU(options);
};
