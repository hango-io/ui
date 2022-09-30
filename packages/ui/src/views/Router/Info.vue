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
                            <span class="white--text text-h5">{{ info.ServiceName.substring(0, 2).toUpperCase() }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.ServiceName }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row justify="center">
                                <v-col>
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
                        <template #PublishStatus="{ item }">
                            <v-chip
                                :color="+item.text === 1 ? 'success' : ''"
                                label
                                x-small
                            >
                                {{ +item.text === 1 ? '已发布' : '未发布' }}
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
        </div>
    </v-container>
</template>
<script>
import RouterRuleInfoComp from './RouterRuleInfo';
export default {
    components: { RouterRuleInfoComp },
    data() {
        return {
            info: null,
        };
    },
    computed: {
        basicInfoList() {
            const info = this.info || {};
            return [
                { label: '路由名称', text: info.RouteRuleName },
                { label: '服务类型', key: 'ServiceType', text: info.ServiceType },
                { label: '所属服务', text: info.ServiceName },
                { label: '发布状态', key: 'PublishStatus', text: info.PublishStatus },
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
                action: 'DescribeRouteRule',
                params: {
                    RouteRuleId: Id,
                },
            }).then(({ RouteRule = {} }) => {
                this.info = RouteRule;
            });
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
