export default {
    version: '版本',
    inject: {
        // 需要在最终特殊注入的参数，不会展示
        abc: 123,
    },

    // formatter: {
    //     maxAge: '&maxAge?',
    //     kind: 'cors',
    //     corsPolicy: { allowMethods: '&allowMethods?', allowHeaders: '&allowHeaders?', exposeHeaders: '&exposeHeaders?', maxAge: '&maxAge?+s', kind: 'cors', allowOriginRegex: '&allowOrigin', allowCredentials: '&allowCredentials' },
    // },
    // layouts: [
    //     { help: '指示请求的资源能共享给哪些域', alias: 'Access-Control-Allow-Origin', rules: ['MaxLength(200)', 'Required', '[^\\*]'], placeholder: '请输入正则表达式', type: 'input', key: 'allowOrigin' },
    //     {
    //         help: '指定对预请求的响应中，哪些HTTP方法允许访问请求的资源',
    //         // default: [],
    //         options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE'],
    //         alias: 'Access-Control-Allow-Methods',
    //         rules: ['Unique'],
    //         type: 'select',
    //         key: 'allowMethods',
    //     },
    //     { help: '用在对预请求的响应中，指示实际的请求中可以使用哪些HTTP头', alias: 'Access-Control-Allow-Headers', rules: ['Unique', 'MaxLength(200)'], type: 'input', key: 'allowHeaders' },
    //     { help: '指示哪些 HTTP 头的名称能在响应中列出', alias: 'Access-Control-Expose-Headers', rules: ['Unique', 'MaxLength(200)'], type: 'input', key: 'exposeHeaders' },
    //     { help: '表示请求中是否允许发送Credentials，包含cookies, authorization headers 或 TLS client certificates', options: ['true', 'false'], alias: 'Access-Control-Allow-Credentials', type: 'radio', key: 'allowCredentials' },
    //     { help: '指示预请求的结果能被缓存多久，单位秒', alias: 'Access-Control-Max-Age', rules: ['Number', 'MinNumber(0)'], type: 'number', key: 'maxAge' },
    // ],

    // formatter: {
    //     kind: 'circuit-breaker',
    //     response: { headers: '&response.headers', code: '&response.code', body: '&response.body' },
    //     config: {
    //         average_response_time: '&rt.rtThreshold',
    //         error_percent_threshold: '&errorPercent.errorPercentThreshold',
    //         consecutive_slow_requests: '&rt.consecutiveSlowRequests',
    //         breakType: '&breakType',
    //         min_request_amount: '&errorPercent.minRequestAmount',
    //         lookback_duration: '&lookbackDuration',
    //         break_duration: '&breakDuration',
    //     },
    // },
    layouts: [
        {
            options: [
                { text: '错误率触发熔断', value: 'ErrorPercentCircuitbreaker' },
                { text: 'RT触发熔断', value: 'RTCircuitbreaker' },
            ],
            alias: '熔断触发条件',
            rules: [ 'Required' ],
            type: 'checkbox',
            key: 'breakType',
            default: [ 'RTCircuitbreaker' ],
        },
        {
            visible: { 'ErrorPercentCircuitbreaker,RTCircuitbreaker': [ 'this', 'breakType' ], 'RTCircuitbreaker,ErrorPercentCircuitbreaker': [ 'this', 'breakType' ], ErrorPercentCircuitbreaker: [ 'this', 'breakType' ] },
            alias: '错误率触发熔断',
            type: 'layouts',
            layouts: [
                {
                    help: '与最小错误数搭配生效，仅在统计窗口内，最小错误数与错误百分比阈值同时满足时触发熔断',
                    alias: '错误百分比阈值',
                    rules: [ 'Required', 'FloatNumber(5)', 'MaxFloatNumber(100.0)', 'MinFloatNumber(0.00001)' ],
                    placeholder: '范围 (0.0, 100.0] 之间',
                    type: 'input',
                    key: 'errorPercentThreshold',
                },
                {
                    help: '与错误百分比阈值搭配生效，仅在统计窗口内，最小错误数与错误百分比阈值同时满足时触发熔断',
                    alias: '最小错误数',
                    rules: [ 'Required', 'Number', 'MinNumber(1)', 'MaxNumber(4294967295)' ],
                    placeholder: '范围 [1, 4294967295] 之间',
                    type: 'input',
                    key: 'minRequestAmount',
                },
            ],
            key: 'errorPercent',
        },
        {
            visible: { 'ErrorPercentCircuitbreaker,RTCircuitbreaker': [ 'this', 'breakType' ], RTCircuitbreaker: [ 'this', 'breakType' ], 'RTCircuitbreaker,ErrorPercentCircuitbreaker': [ 'this', 'breakType' ] },
            alias: 'RT触发熔断',
            type: 'layouts',
            layouts: [
                {
                    help: '慢响应时间阈值，与连续慢响应次数搭配生效，当连续',
                    alias: '慢响应时间阈值',
                    rules: [ 'Required', 'FloatNumber(5)', 'MaxFloatNumber(1000.0)', 'MinFloatNumber(0.00001)' ],
                    placeholder: '单位s，范围 (0, 1000.0]',
                    type: 'input',
                    key: 'rtThreshold',
                },
                { help: '与响应时间阈值，范围 [1, 4294967295] 之间，与慢响应时间阈值搭配生效，当连续有', alias: '连续慢响应次数', rules: [ 'Required', 'Number', 'MinNumber(1)', 'MaxNumber(4294967295)' ], type: 'input', key: 'consecutiveSlowRequests' },
            ],
            key: 'rt',
        },
        { help: '统计时间窗口，单位s，默认10s，最大值为120s', alias: '统计时间窗口', rules: [ 'Required', 'FloatNumber(5)', 'MaxFloatNumber(199.99999)', 'MinFloatNumber(0.00001)' ], placeholder: '单位s，范围(0.0,120.0)', type: 'input', key: 'lookbackDuration' },
        {
            help: '当触发熔断时的惩罚时间，单位s，在该时间内不再请求后端服务而之间返回熔断后的定制响应',
            alias: '熔断惩罚时间',
            rules: [ 'Required', 'FloatNumber(5)', 'MaxFloatNumber(10000.0)', 'MinFloatNumber(0.00001)' ],
            placeholder: '单位s，范围 (0.0, 10000]',
            type: 'input',
            key: 'breakDuration',
        },
        {
            help: '当触发熔断后，会返回此部分定制的响应',
            alias: '定制响应',
            type: 'layouts',
            layouts: [
                { alias: '响应状态码', rules: [ 'Required', 'Number', 'MinNumber(200)', 'MaxNumber(599)' ], placeholder: '请输入 [200, 599] 之间的响应状态码', type: 'input', key: 'code' },
                {
                    alias: '响应头',
                    type: 'map',
                    layouts: [
                        { alias: '请求头', rules: [ 'Required' ], type: 'input', key: 'key' },
                        { alias: '请求头值', rules: [ 'Required' ], type: 'input', key: 'value' },
                    ],
                    key: 'headers',
                },
                { help: '若不填写，则默认返回：circuit breaker filter abort', alias: '请求响应内容', type: 'input', key: 'body' },
            ],
            key: 'response',
        },
    ],
};
