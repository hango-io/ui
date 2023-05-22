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
export const SUPPORT_TYPES_TAG = [
    {
        text: '精确', value: 'exact',
    },
    {
        text: '前缀', value: 'prefix', bans: [ 'Method', 'Query' ],
    },
    {
        text: '正则', value: 'regex', bans: [ 'Method' ],
    },
];
export const SUPPORT_TYPES_MAP = SUPPORT_TYPES_TAG.reduce((obj, item) => {
    obj[item.value] = item;
    return obj;
}, {});

export const SUPPORT_METHOD_KEYS = [ 'POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT', 'PATCH' ];
export const SUPPORT_METHOD_VALUES = SUPPORT_METHOD_KEYS.map(key => ({ text: key, value: key }));
function filterTypes(name) {
    return SUPPORT_TYPES.filter(item => !(item.bans && item.bans.includes(name)));
}
export const SUPOORT_MODAL = {
    Uri: {
        text: 'Path',
        type: 'object',
        required: true, // ruleNames: 'Required',
        actionsable: false,
        modal: [
            { name: '匹配方式', key: 'Type', value: 'exact', placeholder: '请选择匹配方式', select: filterTypes('Path'), ruleNames: 'Required | MaxLength(200)' },
            { name: '条件取值', key: 'Value', value: [], placeholder: '输入条件取值, 多个用回车分隔', multi: true, ruleNames: 'Required | ArrayMaxLength(10) | MaxLength(64) | Unique' },
        ],
        notHiddenEmpty: true,
    },
    Host: {
        text: 'Host',
        type: 'object',
        actionsable: false,
        modal: [
            { name: '匹配方式', key: 'Type', value: 'exact', placeholder: '请选择匹配方式', select: filterTypes('Host'), ruleNames: 'Required | MaxLength(200)' },
            { name: '条件取值', key: 'Value', value: [], placeholder: '输入条件取值, 多个用回车分隔', multi: true, ruleNames: 'Required | ArrayMaxLength(10) | MaxLength(64) | Unique' },
        ],
        notHiddenEmpty: false,
    },
    Method: {
        text: 'Method',
        type: 'object',
        actionsable: false,
        modal: [
            { name: '匹配方式', key: 'Type', value: 'exact', placeholder: '请选择匹配方式', select: filterTypes('Method'), ruleNames: 'Required | MaxLength(200)' },
            { name: '条件取值', key: 'Value', value: [], placeholder: '输入条件取值, 多个用回车分隔', multi: true, select: SUPPORT_METHOD_VALUES, ruleNames: 'Required | MaxLength(200) | Unique' },
        ],
        notHiddenEmpty: false,
    },
    Headers: {
        max: 5,
        text: 'Header',
        modal: [
            { name: '参数名', key: 'Key', value: '', placeholder: '请输入参数名', ruleNames: 'Required | MaxLength(200) |' },
            { name: '匹配方式', key: 'Type', value: 'exact', placeholder: '请选择匹配方式', select: filterTypes('Header'), ruleNames: 'Required | MaxLength(200)' },
            { name: '条件取值', key: 'Value', value: [], placeholder: '输入条件取值, 多个用回车分隔', multi: true, ruleNames: 'Required | ArrayMaxLength(5) | MaxLength(100) | Unique' },
        ],
        notHiddenEmpty: false,
    },
    QueryParams: {
        max: 5,
        text: 'Query',
        modal: [
            { name: '参数名', key: 'Key', value: '', placeholder: '请输入参数名', ruleNames: 'Required | MaxLength(200) |' },
            { name: '匹配方式', key: 'Type', value: 'exact', placeholder: '请选择匹配方式', select: filterTypes('Query'), ruleNames: 'Required | MaxLength(200)' },
            { name: '条件取值', key: 'Value', value: [], placeholder: '输入条件取值, 多个用回车分隔', multi: true, ruleNames: 'Required | ArrayMaxLength(5) | MaxLength(100) | Unique' },
        ],
        notHiddenEmpty: false,
    },
};
export const SUPPORT_KEYS = Object.keys(SUPOORT_MODAL);
export const SUPPORT_VALUES = SUPPORT_KEYS.map(key => ({
    key,
    value: key,
    text: key,
    max: 1,
    min: 0,
    description: ` ${SUPOORT_MODAL[key].text || key}`,
    actionsable: true,
    ...SUPOORT_MODAL[key],
}));

export const SUPOORT_MODAL_TYPES = [
    {
        key: 'Uri',
        text: 'Path',
        type: 'object',
        required: true, // ruleNames: 'Required',
        help: 'path 前缀已自动添加，前缀为：<label style="background: #eee; padding: 2px 6px; border-radius: 6px;">/应用标识/服务标识/</label>',
    },
    // {
    //     key: 'Host',
    //     text: 'Host',
    //     type: 'object',
    //     model: {
    //         Type: 'exact',
    //         Value: [ '' ],
    //     },
    // },
    // {
    //     key: 'Method',
    //     text: 'Method',
    //     type: 'object',
    //     model: {
    //         Type: 'exact',
    //         Value: [],
    //     },
    // },
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
