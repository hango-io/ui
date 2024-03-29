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
    DescribeRouteList: {
        url: '/v1/route',
        method: 'get',
        params: {
            Action: 'DescribeRouteList',
            Version,
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
        url: '/v1/service',
        method: 'post',
        params: {
            Action: 'CreateService',
            Version: '',
        },
    },
    DeleteService: {
        url: '/v1/service',
        method: 'get',
        params: {
            Action: 'DeleteService',
            Version: '',
        },
    },
    UpdateService: {
        url: '/v1/service',
        method: 'post',
        params: {
            Action: 'UpdateService',
            Version: '',
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
    CreateRouteRule: {
        url: '/v1/route',
        method: 'post',
        params: {
            Action: 'CreateRoute',
            Version: '',
        },
    },
    UpdateRouteRule: {
        url: '/v1/route',
        method: 'post',
        params: {
            Action: 'UpdateRoute',
            Version: '',
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
    DeleteRoute: {
        url: '/v1/route',
        method: 'post',
        params: {
            Action: 'DeleteRoute',
            Version,
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
        url: '/v1/service',
        params: {
            Action: 'DescribeHealthCheckRule',
            Version,
        },
    },
    UpdateHealthCheckRule: {
        method: 'post',
        url: '/v1/service',
        params: {
            Action: 'UpdateHealthCheckRule',
            Version: '',
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
    DescribeVirtualGatewayList: {
        url: '/v1/virtualGateway',
        method: 'post',
        params: {
            Action: 'DescribeVirtualGatewayList',
            Version: '2022-10-30',
        },
    },
    // 物理网关列表
    DescribeAllGateway: {
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DescribeAllGateway',
            Version: '2022-10-30',
        },
    },
    CreateVirtualGateway: {
        url: '/v1/virtualGateway',
        method: 'post',
        params: {
            Action: 'CreateVirtualGateway',
            Version: '2022-10-30',
        },
    },
    UpdateVirtualGateway: {
        url: '/v1/virtualGateway',
        method: 'post',
        params: {
            Action: 'UpdateVirtualGateway',
            Version: '2022-10-30',
        },
    },
    // 删除虚拟网关
    DeleteVirtualGateway: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'DeleteVirtualGateway',
            Version: '2022-10-30',
        },
    },
    // 获取虚拟网关详情
    DescribeVirtualGatewayById: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'DescribeVirtualGateway',
            Version: '',
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
    DescribeDomainList: { // 查询域名列表
        url: '/v1/domain',
        method: 'post',
        params: {
            Action: 'DescribeDomainList',
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
        // 删除证书
        url: '/gdashboard',
        method: 'get',
        params: {
            Action: 'DeleteCertificate',
            Version: '2022-10-30',
        },
    },
    // 路由详情
    DescribeRoute: {
        url: '/v1/route',
        method: 'get',
        params: {
            Action: 'DescribeRoute',
            Version,
        },
    },
    // 绑定域名
    BindDomainInfo: {
        url: '/v1/virtualGateway',
        method: 'post',
        params: {
            Action: 'BindDomainInfo',
            Version,
        },
    },
    // 绑定项目
    UpdateProjectBinding: {
        url: '/v1/virtualGateway',
        method: 'post',
        params: {
            Action: 'UpdateProjectBinding',
            Version: '2022-10-30',
        },
    },
    // 解除绑定项目
    UnBindProject: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'UnBindProject',
            Version: '2022-10-30',
        },
    },
    // 解除绑定域名
    UnbindDomainInfo: {
        url: '/v1/virtualGateway',
        method: 'post',
        params: {
            Action: 'UnbindDomainInfo',
            Version: '',
        },
    },
    // 查看ingress
    DescribeIngress: {
        url: '/v1/virtualGateway',
        method: 'get',
        params: {
            Action: 'DescribeIngress',
            Version: '',
        },
    },
};
