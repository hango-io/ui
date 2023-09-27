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
                { title: '服务管理', icon: 'mdi-server', to: { name: 'hango.server' } },
                { title: '路由管理', icon: 'mdi-router', to: { name: 'hango.router' } },
                { title: '插件管理', icon: 'mdi-google-circles-extended', to: { name: 'hango.plugins' } },
                // { title: 'About', icon: 'mdi-help-box' },
                { title: '域名管理', icon: 'mdi-domain', to: { name: 'hango.domain' } },
            ],
            globalMenus: [
                { title: '网关管理', icon: 'mdi-cog', to: { name: 'hango.manager' } },
                { title: '虚拟网关管理', icon: 'mdi-message-text', to: { name: 'hango.virtualManager' } },
                { title: '插件市场', icon: 'mdi-shopping-outline', to: { name: 'hango.pluginMarket' } },
                { title: 'SSL证书管理', icon: 'mdi-certificate', to: { name: 'hango.certify' } },
            ],
        };
    },
};
</script>

