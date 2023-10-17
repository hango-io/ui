import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import _ from 'lodash';
import apiMap from '@/service';

// 创建axios实例
const service = axios.create({
    baseURL: '/proxy/api/gportal', // api 的 base_url
    timeout: 30 * 1000, // 请求超时时间
});
// request 拦截器
service.interceptors.request.use(
    config => {
        if (config.action) {
            const actionConfig = apiMap[config.action];
            if (actionConfig) {
                config = _.merge({}, config, actionConfig);
            }
        }
        config.headers.common['x-auth-projectId'] = 1;
        config.headers.common['x-auth-tenantId'] = 1;
        config.headers.common['X-163-AcceptLanguage'] = 'zh';
        // config.headers.common['x-auth-accountId'] = 'admin';
        // config.headers.common['x-auth-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50SWQiOiJhZG1pbiIsIlBlcm1pc3Npb25UeXBlIjoiZnVuY3Rpb24iLCJJZCI6IjEiLCJSRUdJU1RSQVRJT04iOiLns7vnu5_lr7zlhaUiLCJleHAiOjE2OTcyMjA2MzQsImlhdCI6MTY5NzE2MzAzNCwiRW52SW5mbyI6ImNvbnNvbGUudGVzdDI1MS1xaW5nemhvdS5jb20ifQ.RGfX-fw32kjEXs4ppde6GXVbJvE935bPWzobUqboUPQ';

        // console.info('config:', JSON.stringify(config, false, 4));
        return config;
    },
    error => {
        console.error(error);
        return Promise.reject(error);
    }
);
// response 拦截器
service.interceptors.response.use(
    response => {
        return response.data;
    },
    err => {
        console.error(err); // for debug
        const data = err.response.data;
        if (data) {
            Vue.$notify.error(data.message || data.Message || '操作失败');
        }
        return Promise.reject(err);
    }
);

Vue.use(VueAxios, service);
