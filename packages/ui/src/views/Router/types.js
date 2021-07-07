export const SUPPORT_TYPES = [
    {
        text: '精确匹配', value: 'exact',
    },
    {
        text: '前缀匹配', value: 'prefix', bans: [ 'Method' ],
    },
    {
        text: '正则表达式', value: 'regex', bans: [ 'Method' ],
    },
];

export const SUPPORT_METHOD_KEYS = [ 'POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT', 'PATCH' ];
export const SUPPORT_METHOD_VALUES = SUPPORT_METHOD_KEYS.map(key => ({ text: key, value: key }));

export const SUPOORT_MODAL_TYPES = [
    {
        key: 'Uri',
        text: 'Path',
        type: 'object',
        required: true, // ruleNames: 'Required',
        help: 'path 前缀已自动添加，前缀为：<label style="background: #eee; padding: 2px 6px; border-radius: 6px;">/应用标识/服务标识/</label>',
    },
    {
        key: 'Host',
        text: 'Host',
        type: 'object',
        model: {
            Type: 'exact',
            Value: [ '' ],
        },
    },
    {
        key: 'Method',
        text: 'Method',
        type: 'object',
        model: {
            Type: 'exact',
            Value: [],
        },
    },
    {
        key: 'Headers',
        text: 'Header',
        type: 'array',
        max: 5,
        model: {
            Key: '',
            Type: 'exact',
            Value: [ '' ],
        },
    },
    {
        key: 'QueryParams',
        text: 'Query',
        type: 'array',
        max: 5,
        model: {
            Key: '',
            Type: 'exact',
            Value: [ '' ],
        },
    },
];
