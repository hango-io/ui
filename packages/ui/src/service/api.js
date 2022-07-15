export default {
    // 服务管理
    DescribeServiceList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeServiceList',
            Version: '2018-08-09',
        },
    },
    // 路由管理
    DescribeRouteRuleList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeRouteRuleList',
            Version: '2019-09-01',
        },
    },
    // 已发布服务管理
    DescribeEnvoyServiceProxyList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeServiceProxyList',
            Version: '2019-09-01',
        },
    },
    // 已发布路由管理
    DescribePublishRouteRuleList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeRouteRuleProxyList',
            Version: '2019-09-01',
        },
    },
    DescribeBindingPlugins: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeBindingPlugins',
            Version: '2019-09-01',
        },
    },
    DescribeGatewayListForGatewayTab: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeGatewayList',
            Version: '2019-09-01',
        },
    },
    CreateService: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'CreateService',
            Version: '2018-08-09',
        },
    },
    DeleteService: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DeleteService',
            Version: '2018-08-09',
        },
    },
    UpdateService: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'UpdateService',
            Version: '2018-08-09',
        },
    },
    DescribeGatewayList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeGatewayList',
            Version: '2019-09-01',
        },
    },
    GetRegistryCenterList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'GetRegistryCenterList',
            Version: '2019-09-01',
        },
    },
    DescribeServiceListByGw: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeServiceListByGw',
            Version: '2019-09-01',
        },
    },
    PublishService: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'PublishService',
            Version: '2019-09-01',
        },
    },
    CreateRouteRule: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'CreateRouteRule',
            Version: '2019-09-01',
        },
    },
    UpdateRouteRule: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'UpdateRouteRule',
            Version: '2019-09-01',
        },
    },
    DescribeGatewayForPublishedRule: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeGatewayForRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    DescribeServiceProxyForPublishRoute: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeServiceProxyForRouteProxy',
            Version: '2019-09-01',
        },
    },
    PublishRouteRule: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'PublishRouteRule',
            Version: '2019-09-01',
        },
    },
    DeleteRouteRule: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DeleteRouteRule',
            Version: '2019-09-01',
        },
    },
    DeleteServiceProxy: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DeleteServiceProxy',
            Version: '2019-09-01',
        },
    },
    DeletePublishedRouteRule: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DeleteRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    CreateGateway: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'CreateGateway',
            Version: '2019-09-01',
        },
    },
    UpdateGateway: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'UpdateGateway',
            Version: '2019-09-01',
        },
    },
    DescribePluginInfoList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribePluginInfoList',
            Version: '2019-09-01',
        },
    },
    DescribePluginInfo: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribePluginInfo',
            Version: '2019-09-01',
        },
    },
    BindingPlugin: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'BindingPlugin',
            Version: '2019-09-01',
        },
    },
    DescribeBindingPlugin: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeBindingPlugin',
            Version: '2019-09-01',
        },
    },
    UpdatePluginConfiguration: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'UpdatePluginConfiguration',
            Version: '2019-09-01',
        },
    },
    UnbindingPlugin: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'UnbindingPlugin',
            Version: '2019-09-01',
        },
    },
    UpdatePluginBindingStatus: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'UpdatePluginBindingStatus',
            Version: '2019-09-01',
        },
    },
    // -------
    DescribeGatewayById: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeGateway',
            Version: '2019-09-01',
        },
    },
    DescribePublishRouteRuleById: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    DescribePublishedRouteRule: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    DescribePublishRouteRuleByRouteRuleId: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeRouteRuleProxyByRouteRuleId',
            Version: '2019-09-01',
        },
    },
    UpdateRouteRuleEnableState: {
        url: '/gdashboard',
        params: {
            Action: 'UpdateRouteRuleProxyEnableState',
            Version: '2019-09-01',
        },
    },
    UpdatePublishService: {
        url: '/gdashboard',
        params: {
            Action: 'UpdateServiceProxy',
            Version: '2019-09-01',
        },
    },
    DescribeServiceById: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeServiceById',
            Version: '2018-08-09',
        },
    },
    DescribeServiceProxy: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeServiceProxy',
            Version: '2019-09-01',
        },
    },
    DescribeRouteRule: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeRouteRule',
            Version: '2019-09-01',
        },
    },
    DescribeHealthCheckRule: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeHealthCheckRule',
            Version: '2019-09-01',
        },
    },
    UpdateHealthCheckRule: {
        method: 'post',
        url: '/gdashboard',
        params: {
            Action: 'UpdateHealthCheckRule',
            Version: '2019-09-01',
        },
    },
};
