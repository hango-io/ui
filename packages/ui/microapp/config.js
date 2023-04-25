const path = require('path');
process.env.VUE_CLI_SERVICE_CONFIG_PATH = path.resolve(__dirname, 'vue.config.js');

const config = {
    type: 'app', // 类型

    entry: {
        app: [ './src/main.js' ],
    },

    htmls: [{
        title: 'Hango 网关',
        filename: 'index.html',
        hash: true,
        template: './public/index.html',
    }],

    alias: { // 前端
        components: {
            link: path.resolve(__dirname, 'src/components/'),
            description: 'Hango 网关业务组件',
        },
        service: {
            link: path.resolve(__dirname, 'src/service/'),
            description: 'Hango 网关业务接口',
        },
        views: {
            link: path.resolve(__dirname, 'src/views/'),
            description: 'Hango 网关渲染页面',
        },
        assets: {
            link: path.resolve(__dirname, 'src/assets/'),
            description: 'Hango 网关共享资源集',
        },
        router: {
            link: path.resolve(__dirname, 'src/router/'),
            description: 'Hango 网关路由',
        },
    },

    // plugins: require('./plugins'),

    devServer: {
        proxy: {
            '/proxy/api/gportal': {
                // target: 'http://portal.hango.io:30384/',
                target: 'http://apigw-gportal.test283-qingzhou.com',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/proxy/api/gportal': '',
                },
                onProxyReq(proxyReq, req, res) {
                    proxyReq.setHeader('x-auth-projectId', 3); // add new header to response
                    proxyReq.setHeader('x-auth-tenantId', 2); // add new header to response
                    proxyReq.setHeader('x-auth-accountId', 'admin');
                    proxyReq.setHeader('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50SWQiOiJhZG1pbiIsIlBlcm1pc3Npb25UeXBlIjoiZnVuY3Rpb24iLCJJZCI6IjEiLCJSRUdJU1RSQVRJT04iOiLns7vnu5_lr7zlhaUiLCJleHAiOjE2ODIzNjE1MTAsImlhdCI6MTY4MjMwMzkxMCwiRW52SW5mbyI6ImNvbnNvbGUudGVzdDI4My1xaW5nemhvdS5jb20ifQ.4Xp0mQ67rlS-sebhfvMJ9Bltrqbfr3aK0hJ3Fp2lfPM');
                },
            },
        },
    },
};

module.exports = config;
