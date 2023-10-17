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
                target: 'http://hango-portal.test312-qingzhou.com:80/',
                // target: 'http://apigw-gportal.test251-qingzhou.com:80',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/proxy/api/gportal': '',
                },
                onProxyReq(proxyReq, req, res) {
                    proxyReq.setHeader('x-auth-projectId', 1); // add new header to response
                    proxyReq.setHeader('x-auth-tenantId', 1); // add new header to response
                    // proxyReq.setHeader('x-auth-accountId', 'admin');
                    // proxyReq.setHeader('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50SWQiOiJhZG1pbiIsIlBlcm1pc3Npb25UeXBlIjoiZnVuY3Rpb24iLCJJZCI6IjEiLCJSRUdJU1RSQVRJT04iOiLns7vnu5_lr7zlhaUiLCJleHAiOjE2OTcyMjA2MzQsImlhdCI6MTY5NzE2MzAzNCwiRW52SW5mbyI6ImNvbnNvbGUudGVzdDI1MS1xaW5nemhvdS5jb20ifQ.RGfX-fw32kjEXs4ppde6GXVbJvE935bPWzobUqboUPQ'); // add new header to response
                },
            },
        },
    },
};

module.exports = config;
