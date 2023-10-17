export const TYPE_TEXT = {
    security: '安全防护',
    auth: '认证鉴权',
    trafficPolicy: '流量管理',
    dataFormat: '数据转换',
};
export const PLUGIN_TYPES = [
    { value: 'security', text: '安全防护' },
    { value: 'auth', text: '认证鉴权' },
    { value: 'trafficPolicy', text: '流量管理' },
    { value: 'dataFormat', text: '数据转换' },
];
export const PluginScope = value => {
    switch (value) {
        case 'routeRule':
            return '路由';
        case 'service':
            return '服务';
        case 'global':
            return '项目';
        case 'host':
            return 'Host';
        case 'gateway':
            return '网关';
        default:
    }
    return '-';
};
