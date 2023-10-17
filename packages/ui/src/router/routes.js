
const routes = [
    {
        path: '/',
        redirect: { name: 'hango.server' },
    },
    {
        path: '/server',
        name: 'hango.server',
        component: () => import(/* webpackChunkName: "server" */ '../views/Server/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '服务管理',
                    disabled: true,
                    // to: { name: 'hango.server' },
                },
            ],
        },
    },
    {
        path: '/server/info',
        name: 'hango.server.info',
        component: () => import(/* webpackChunkName: "server" */ '../views/Server/Info.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '服务管理',
                    disabled: false,
                    exact: true,
                    to: { name: 'hango.server' },
                },
                {
                    text: '服务详情',
                    disabled: true,
                    // to: { name: 'hango.server.info' },
                },
            ],
        },
    },
    {
        path: '/router',
        name: 'hango.router',
        component: () => import(/* webpackChunkName: "router" */ '../views/Router/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '路由管理',
                    disabled: true,
                    to: { name: 'hango.router' },
                },
            ],
        },
    },
    {
        path: '/router/info',
        name: 'hango.router.info',
        component: () => import(/* webpackChunkName: "router" */ '../views/Router/Info.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '路由管理',
                    disabled: false,
                    exact: true,
                    to: { name: 'hango.router' },
                },
                {
                    text: '路由详情',
                    disabled: true,
                    // to: { name: 'hango.router.info' },
                },
            ],
        },
    },
    {
        path: '/plugins',
        name: 'hango.plugins',
        component: () => import(/* webpackChunkName: "plugins" */ '../views/Plugins/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '插件管理',
                    disabled: true,
                    to: { name: 'hango.plugins' },
                },
            ],
        },
    },
    {
        path: '/domain',
        name: 'hango.domain',
        component: () => import(/* webpackChunkName: "plugins" */ '../views/Domain/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '域名管理',
                    disabled: true,
                    to: { name: 'hango.domain' },
                },
            ],
        },
    },
    {
        path: '/manager',
        name: 'hango.manager',
        component: () => import(/* webpackChunkName: "manager" */ '../views/Manager/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '网关管理',
                    disabled: true,
                    to: { name: 'hango.manager' },
                },
            ],
        },
    },
    {
        path: '/virtualManager',
        name: 'hango.virtualManager',
        component: () => import(/* webpackChunkName: "manager" */ '../views/VirtualManager/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '虚拟网关管理',
                    disabled: true,
                    to: { name: 'hango.virtualManager' },
                },
            ],
        },
    },
    {
        path: '/pluginMarket',
        name: 'hango.pluginMarket',
        component: () => import(/* webpackChunkName: "manager" */ '../views/pluginMarket/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '插件市场',
                    disabled: true,
                    to: { name: 'hango.pluginMarket' },
                },
            ],
        },
    },
    {
        path: '/pluginMarket/info',
        name: 'hango.pluginMarket.info',
        component: () => import(/* webpackChunkName: "manager" */ '../views/pluginMarket/Info.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '插件市场详情',
                    disabled: true,
                    to: { name: 'hango.pluginMarket.info' },
                },
            ],
        },
    },
    {
        path: '/pluginMarket/uploadPlugin',
        name: 'hango.pluginMarket.upload',
        component: () => import(/* webpackChunkName: "manager" */ '../views/pluginMarket/uploadPlugin.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '导入插件',
                    disabled: true,
                    to: { name: 'hango.pluginMarket.upload' },
                },
            ],
        },
    },
    {
        path: '/virtualManager/info',
        name: 'hango.virtualManager.info',
        component: () => import(/* webpackChunkName: "router" */ '../views/VirtualManager/Info.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '虚拟网关管理',
                    disabled: false,
                    exact: true,
                    to: { name: 'hango.virtualManager' },
                },
                {
                    text: '虚拟网关详情',
                    disabled: true,
                    // to: { name: 'hango.router.info' },
                },
            ],
        },
    },
    {
        path: '/certify',
        name: 'hango.certify',
        component: () => import(/* webpackChunkName: "plugins" */ '../views/Certify/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: 'SSL证书管理',
                    disabled: true,
                    to: { name: 'hango.certify' },
                },
            ],
        },
    },
    // {
    //     path: '/api',
    //     name: 'hango.api',
    //     component: () => import(/* webpackChunkName: "api" */ '../views/API/Index.vue'),
    // },
];

export default routes;
