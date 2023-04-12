const url = '/v1/service';
const Version = '';
export default {
    // 服务管理
    DescribeServiceList: {
        url,
        method: 'get',
        params: {
            Action: 'DescribeServicePage',
            Version,
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
            Action: 'DescribePublishRouteRuleList',
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
            Version: '2018-08-09',
        },
    },
    DescribeGatewayByNamePaged: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeGatewayByNamePaged',
            Version: '2022-10-30',
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
            Version: '2018-08-09',
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
        url,
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
            Action: 'DescribeGatewayForPublishedRule',
            Version: '2019-09-01',
        },
    },
    DescribeServiceProxyForPublishRoute: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribePublishRouteRuleById',
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
            Action: 'DeletePublishedRouteRule',
            Version: '2019-09-01',
        },
    },
    CreateGateway: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'CreateGateway',
            Version: '2022-10-30',
        },
    },
    UpdateGateway: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'UpdateGateway',
            Version: '2022-10-30',
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
            Version: '2018-08-09',
        },
    },
    DescribePublishRouteRuleById: {
        url: '/gdashboard',
        params: {
            Action: 'DescribePublishRouteRuleById',
            Version: '2019-09-01',
        },
    },
    DescribePublishedRouteRule: {
        url: '/gdashboard',
        params: {
            Action: 'DescribePublishRouteRuleById',
            Version: '2019-09-01',
        },
    },
    DescribePublishRouteRuleByRouteRuleId: {
        url: '/gdashboard',
        params: {
            Action: 'DescribePublishRouteRuleByRouteRuleId',
            Version: '2019-09-01',
        },
    },
    UpdateRouteRuleEnableState: {
        url: '/gdashboard',
        params: {
            Action: 'UpdateRouteRuleEnableState',
            Version: '2019-09-01',
        },
    },
    UpdatePublishService: {
        url: '/gdashboard',
        params: {
            Action: 'UpdatePublishService',
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
    DescribePublishedDubbo: {
        url: '/gdashboard',
        params: {
            Action: 'DescribePublishedDubbo',
            Version: '2020-10-29',
        },
    },
    DescribeDubboMeta: {
        url: '/gdashboard',
        params: {
            Action: 'DescribeDubboMeta',
            Version: '2021-10-30',
        },
    },
    PublishDubbo: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'PublishDubbo',
            Version: '2020-10-29',
        },
    },
    OfflineDubbo: {
        url: '/gdashboard/envoy',
        method: 'get',
        params: {
            Action: 'OfflineDubbo',
            Version: '2020-10-29',
        },
    },
    RefreshDubboMeta: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'RefreshDubboMeta',
            Version: '2021-10-30',
        },
    },
    DescribeRegistryTypes: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeRegistryTypes',
            Version: '2019-09-01',
        },
    },
    DescribeVirtualGateway: {
        url: '/v1/virtualGateway',
        method: 'post',
        params: {
            Action: 'DescribeVirtualGatewayPage',
            Version: '2022-10-30',
        },
    },
    // 虚拟网关所属网关列表
    DescribeAllGateway: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeAllGateway',
            Version: '2022-10-30',
        },
    },
    CreateVirtualGateway: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'CreateVirtualGateway',
            Version: '2022-10-30',
        },
    },
    UpdateVirtualGateway: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'UpdateVirtualGateway',
            Version: '2022-10-30',
        },
    },
    // 删除虚拟网关
    DeleteVirtualGateway: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DeleteVirtualGatewayFromHango',
            Version: '2022-10-30',
        },
    },
    // 获取虚拟网关详情
    DescribeVirtualGatewayById: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeVirtualGatewayById',
            Version: '2022-10-30',
        },
    },
    // 查询K8s Gateway
    DescribeKubernetesGateway: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'DescribeKubernetesGateway',
        },
    },
    // 查询Kubernetes Gateway Yaml
    DescribeKubernetesGatewayYaml: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'DescribeKubernetesGatewayYaml',
            Version: '',
        },
    },
    // 查询K8s Httproute列表
    DescribeHTTPRoute: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'DescribeHTTPRoute',
            Version: '',
        },
    },
    // 查询虚拟网关-插件配置
    DescribePluginManager: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribePluginManager',
            Version: '2019-09-01',
        },
    },
    // 更新插件
    UpdatePluginManager: {
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'UpdatePluginManager',
            Version: '2019-09-01',
        },
    },
    // 虚拟网关刷新
    RefreshKubernetesGateway: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'RefreshKubernetesGateway',
            Version: '',
        },
    },
    // 服务详情
    DescribeService: {
        url,
        method: 'get',
        params: {
            Action: 'DescribeService',
            Version,
        },
    },
    DescribeDomainPage: { // 查询虚拟网关下绑定的域名
        url: '/v1/domain',
        method: 'post',
        params: {
            Action: 'DescribeDomainPage',
            Version: '',
        },
    },
    // 通过证书Id或项目Id查询证书详情
    DescribeCertificateInfo: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeCertificateInfo',
            Version: '2022-10-30',
        },
    },
    // 证书列表
    DescribeCertificateList: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeCertificateList',
            Version: '2022-10-30',
        },
    },
    CreateDomain: { // 创建域名
        url: '/v1/domain',
        method: 'post',
        params: {
            Action: 'CreateDomain',
        },
    },
    UpdateDomain: { // 修改域名
        url: '/v1/domain',
        method: 'post',
        params: {
            Action: 'UpdateDomain',
        },
    },
    DeleteDomain: { // 删除域名
        url: '/v1/domain',
        method: 'get',
        params: {
            Action: 'DeleteDomain',
        },
    },
    CreateCertificate: {
        // 创建证书
        url: '/gdashboard',
        method: 'post',
        params: {
            Action: 'CreateCertificate',
            Version: '2022-10-30',
        },
    },
    DeleteCertificate: {
        // 创建证书
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DeleteCertificate',
            Version: '2022-10-30',
        },
    },
};
