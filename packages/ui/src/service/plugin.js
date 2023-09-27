const url = '/v1/plugin';
const Version = '';
export default {
    // 查询插件市场列表
    DescribeCustomPluginList: {
        url,
        method: 'post',
        params: {
            Action: 'DescribeCustomPluginList',
            Version,
        },
    },
    // 删除插件市场列表数据
    DeletePlugin: {
        url,
        method: 'get',
        params: {
            Action: 'DeletePlugin',
            Version,
        },
    },
    // 插件市场上架/下架
    UpdatePluginStatus: {
        url,
        method: 'post',
        params: {
            Action: 'UpdatePluginStatus',
            Version,
        },
    },
    // 根据id查看插件市场详情
    DescribeCustomPluginInfo: {
        url,
        method: 'get',
        params: {
            Action: 'DescribeCustomPluginInfo',
            Version,
        },
    },
    // 插入自定义插件
    PluginImport: {
        url,
        method: 'post',
        params: {
            Action: 'PluginImport',
            Version,
        },
    },
    // 修改自定义插件
    PluginUpdate: {
        url,
        method: 'post',
        params: {
            Action: 'PluginUpdate',
            Version,
        },
    },
    // 查询插件实例列表
    DescribeCustomPluginInstanceList: {
        url,
        method: 'post',
        params: {
            Action: 'DescribeCustomPluginInstanceList',
            Version,
        },
    },
};
