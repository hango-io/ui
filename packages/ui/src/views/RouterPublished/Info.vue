<template>
    <v-container fluid>
        <v-breadcrumbs
            class="pl-3"
            v-if="$route.meta && $route.meta.breadcrumbs"
            large
            :items="$route.meta.breadcrumbs"
        >
        </v-breadcrumbs>
        <div v-if="info">
            <v-card
                class="mx-auto mb-4"
            >
                <v-list-item two-line>
                    <v-list-item-avatar
                        tile
                        size="54"
                    >
                        <v-avatar
                            color="secondary"
                            size="54"
                        >
                            <span class="white--text text-h5">{{ info.RouteRuleName.substring(0, 2).toUpperCase() }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.RouteRuleName }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row dense>
                                <v-col cols="12">
                                    <g-label>所属服务：</g-label>
                                    <span>{{ info.ServiceName || '-' }}</span>
                                </v-col>
                                <v-col cols="12">
                                    <g-label>服务类型：</g-label>
                                    <v-chip
                                        :color="info.ServiceType === 'dubbo' ? 'indigo' : 'info'"
                                        text-color="white"
                                        label
                                        x-small
                                    >
                                        {{ info.ServiceType && info.ServiceType.toUpperCase() || '-' }}
                                    </v-chip>
                                </v-col>
                                <v-col cols="12">
                                    <g-label>所属网关：</g-label>
                                    <span>{{ info.GwName || '-' }}</span>
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-row>
                <v-col>
                    <g-info-card
                        title="基础信息"
                        :list="basicInfoList">
                        <template #ServiceType="{ item }">
                            <v-chip
                                :color="item.text === 'dubbo' ? 'indigo' : 'info'"
                                text-color="white"
                                x-small
                                label
                            >
                                {{ item.text && item.text.toUpperCase() || '-' }}
                            </v-chip>
                        </template>
                        <template #EnableState="{ item }">
                            <v-chip
                                x-small
                                :color="item.text === 'enable' ? 'success' : 'error'"
                                label
                            >
                                {{ item.text !== 'enable' ? '已禁用' : '已启用' }}
                            </v-chip>
                        </template>
                        <template #Priority="{ item }">
                            <v-chip
                                x-small
                                color="primary"
                                label
                            >
                                {{ item.text || '-' }}
                            </v-chip>
                        </template>
                    </g-info-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <g-info-card title="路由规则">
                        <RouterRuleInfoComp :data="info"/>
                    </g-info-card>
                </v-col>
            </v-row>
            <v-row v-if="info.ServiceType === 'dubbo'">
                <v-col>
                    <ConvertInfo :info="info" :serviceProxyInfo="serviceProxyInfo"/>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>
<script>
import RouterRuleInfoComp from '@/views/Router/RouterRuleInfo';
import ConvertInfo from '@/views/RouterPublished/Convert';
export default {
    components: { RouterRuleInfoComp, ConvertInfo },
    data() {
        return {
            info: null,
            serviceProxyInfo: null,
        };
    },
    computed: {
        basicInfoList() {
            const info = this.info || {};
            return [
                { label: '路由名称', text: info.RouteRuleName },
                { label: '所属网关', text: info.GwName },
                { label: '服务类型', key: 'ServiceType', text: info.ServiceType },
                { label: '所属服务', text: info.ServiceName },
                { label: '使能状态', key: 'EnableState', text: info.EnableState },
                { label: '优先级', key: 'Priority', text: info.Priority },
                { label: '创建时间', key: 'CreateTime', text: info.CreateTime },
                { label: '修改时间', key: 'UpdateTime', text: info.UpdateTime },
                { label: '备注信息', text: info.Description },
            ];
        },
    },
    methods: {
        loadInfo() {
            const { Id } = this.$route.query || {};
            if (!Id) {
                return this.$router.replace(this.$route.meta && this.$route.meta.breadcrumbs && this.$route.meta.breadcrumbs[0].to || '/');
            }
            return this.axios({
                action: 'DescribePublishRouteRuleById',
                params: {
                    Id,
                },
            }).then(({ RouteRuleProxy = {} }) => {
                this.info = RouteRuleProxy;
                this.loadServiceProxyInfo();
            });
        },
        loadServiceProxyInfo() {
            const { GwId, ServiceId, Id } = this.info;
            if (!ServiceId) return;
            return this.axios({
                action: 'DescribeServiceProxyForPublishRoute',
                params: { ServiceId, GwId, Id },
            }).then(({ EnvoyServiceProxy = {} }) => {
                this.serviceProxyInfo = EnvoyServiceProxy || {};
            });
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
