<template>
    <v-navigation-drawer app permanent expand-on-hover clipped>
        <v-list dense nav>
            <v-list-item v-for="item in menus" :key="item.title" active-class="secondary white--text" link :to="item.to">
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider class="mb-1"></v-divider>

            <v-list-item v-for="item in globalMenus" :key="item.title" active-class="secondary white--text" link :to="item.to">
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    data() {
        return {
            menus: [
                // { title: '总览', icon: 'mdi-view-dashboard', to: { name: 'hango.dashboard' } },
                { title: '服务管理', icon: 'mdi-server', to: { name: 'hango.server' } },
                { title: '路由管理', icon: 'mdi-router', to: { name: 'hango.router' } },
                // { title: 'API 管理', icon: 'mdi-api', to: { name: 'hango.api' } },
                // { title: '已发布服务管理', icon: 'mdi-server-network', to: { name: 'hango.published.server' } },
                // { title: '已发布路由管理', icon: 'mdi-router-network', to: { name: 'hango.published.router' } },
                { title: '插件管理', icon: 'mdi-google-circles-extended', to: { name: 'hango.plugins' } },
                // { title: 'About', icon: 'mdi-help-box' },
                { title: '域名管理', icon: 'mdi-domain', to: { name: 'hango.domain' } },
            ],
            globalMenus: [
                { title: '网关管理', icon: 'mdi-cog', to: { name: 'hango.manager' } },
                { title: '虚拟网关管理', icon: 'mdi-message-text', to: { name: 'hango.virtualManager' } },
                { title: 'SSL证书管理', icon: 'mdi-certificate', to: { name: 'hango.certify' } },
            ],
        };
    },
};
</script>

