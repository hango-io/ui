export default {
    // 服务管理
    DescribeServiceList: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeServiceList',
            Version: '2019-09-01',
        },
    },
    // 路由管理
    DescribeRouteRuleList: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeRouteRuleList',
            Version: '2019-09-01',
        },
    },
    // 已发布服务管理
    DescribeEnvoyServiceProxyList: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeServiceProxyList',
            Version: '2019-09-01',
        },
    },
    // 已发布路由管理
    DescribePublishRouteRuleList: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeRouteRuleProxyList',
            Version: '2019-09-01',
        },
    },
    DescribeBindingPlugins: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeBindingPlugins',
            Version: '2019-09-01',
        },
    },
    DescribeGatewayListForGatewayTab: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeGatewayList',
            Version: '2019-09-01',
        },
    },
    CreateService: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'CreateService',
            Version: '2019-09-01',
        },
    },
    DeleteService: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DeleteService',
            Version: '2019-09-01',
        },
    },
    UpdateService: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'UpdateService',
            Version: '2019-09-01',
        },
    },
    DescribeGatewayList: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeGatewayList',
            Version: '2019-09-01',
        },
    },
    GetRegistryCenterList: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'GetRegistryCenterList',
            Version: '2019-09-01',
        },
    },
    DescribeServiceListByGw: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeServiceListByGw',
            Version: '2019-09-01',
        },
    },
    PublishService: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'PublishService',
            Version: '2019-09-01',
        },
    },
    CreateRouteRule: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'CreateRouteRule',
            Version: '2019-09-01',
        },
    },
    UpdateRouteRule: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'UpdateRouteRule',
            Version: '2019-09-01',
        },
    },
    DescribeGatewayForPublishedRule: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeGatewayForRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    DescribeServiceProxyForPublishRoute: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeServiceProxyForRouteProxy',
            Version: '2019-09-01',
        },
    },
    PublishRouteRule: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'PublishRouteRule',
            Version: '2019-09-01',
        },
    },
    DeleteRouteRule: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DeleteRouteRule',
            Version: '2019-09-01',
        },
    },
    DeleteServiceProxy: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DeleteServiceProxy',
            Version: '2019-09-01',
        },
    },
    DeletePublishedRouteRule: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DeleteRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    CreateGateway: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'CreateGateway',
            Version: '2019-09-01',
        },
    },
    UpdateGateway: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'UpdateGateway',
            Version: '2019-09-01',
        },
    },
    DescribePluginInfoList: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribePluginInfoList',
            Version: '2019-09-01',
        },
    },
    DescribePluginInfo: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribePluginInfo',
            Version: '2019-09-01',
        },
    },
    BindingPlugin: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'BindingPlugin',
            Version: '2019-09-01',
        },
    },
    DescribeBindingPlugin: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'DescribeBindingPlugin',
            Version: '2019-09-01',
        },
    },
    UpdatePluginConfiguration: {
        url: '/gdashboard/envoy',
        method: 'post',
        params: {
            Action: 'UpdatePluginConfiguration',
            Version: '2019-09-01',
        },
    },
    UnbindingPlugin: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'UnbindingPlugin',
            Version: '2019-09-01',
        },
    },
    UpdatePluginBindingStatus: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'UpdatePluginBindingStatus',
            Version: '2019-09-01',
        },
    },
    // -------
    DescribeGatewayById: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeGateway',
            Version: '2019-09-01',
        },
    },
    DescribePublishRouteRuleById: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    DescribePublishedRouteRule: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeRouteRuleProxy',
            Version: '2019-09-01',
        },
    },
    DescribePublishRouteRuleByRouteRuleId: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeRouteRuleProxyByRouteRuleId',
            Version: '2019-09-01',
        },
    },
    UpdateRouteRuleEnableState: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'UpdateRouteRuleProxyEnableState',
            Version: '2019-09-01',
        },
    },
    UpdatePublishService: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'UpdateServiceProxy',
            Version: '2019-09-01',
        },
    },
    DescribeServiceById: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeServiceById',
            Version: '2019-09-01',
        },
    },
    DescribeServiceProxy: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeServiceProxy',
            Version: '2019-09-01',
        },
    },
    DescribeRouteRule: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeRouteRule',
            Version: '2019-09-01',
        },
    },
    DescribeHealthCheckRule: {
        url: '/gdashboard/envoy',
        params: {
            Action: 'DescribeHealthCheckRule',
            Version: '2019-09-01',
        },
    },
    UpdateHealthCheckRule: {
        method: 'post',
        url: '/gdashboard/envoy',
        params: {
            Action: 'UpdateHealthCheckRule',
            Version: '2019-09-01',
        },
    },
};
