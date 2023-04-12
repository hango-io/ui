
const routes = [
    {
        path: '/',
        redirect: { name: 'hango.server' },
    },
    // {
    //     path: '/dashboard',
    //     name: 'hango.dashboard',
    //     // component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard/Index.vue'),
    //     // meta: {
    //     //     breadcrumbs: [
    //     //         {
    //     //             text: 'Dashboard',
    //     //             disabled: true,
    //     //             to: { name: 'hango.dashboard' },
    //     //         },
    //     //     ],
    //     // },
    //     redirect: { name: 'hango.server' },
    // },
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
        path: '/published/server',
        name: 'hango.published.server',
        component: () => import(/* webpackChunkName: "server" */ '../views/ServerPublished/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '已发布服务管理',
                    disabled: true,
                    to: { name: 'hango.published.server' },
                },
            ],
        },
    },
    {
        path: '/published/server/info',
        name: 'hango.published.server.info',
        component: () => import(/* webpackChunkName: "server" */ '../views/ServerPublished/Info.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '已发布服务管理',
                    disabled: false,
                    exact: true,
                    to: { name: 'hango.published.server' },
                },
                {
                    text: '服务详情',
                    disabled: true,
                    // to: { name: 'hango.published.server.info' },
                },
            ],
        },
    },
    {
        path: '/published/router',
        name: 'hango.published.router',
        component: () => import(/* webpackChunkName: "router" */ '../views/RouterPublished/Index.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '已发布路由管理',
                    disabled: true,
                    to: { name: 'hango.published.router' },
                },
            ],
        },
    },
    {
        path: '/published/router/info',
        name: 'hango.published.router.info',
        component: () => import(/* webpackChunkName: "router" */ '../views/RouterPublished/Info.vue'),
        meta: {
            breadcrumbs: [
                {
                    text: '已发布路由管理',
                    disabled: false,
                    exact: true,
                    to: { name: 'hango.published.router' },
                },
                {
                    text: '路由详情',
                    disabled: true,
                    // to: { name: 'hango.published.router.info' },
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
