<template>
    <v-container fluid>
        <v-breadcrumbs
            class="pl-3"
            v-if="$route.meta && $route.meta.breadcrumbs"
            large
            :items="$route.meta.breadcrumbs"
        ></v-breadcrumbs>
        <div>
            <g-table-list :headers="headers" :load="loadList" ref="tableRef">
                <template #top>
                    <ActionBtnComp
                        icon="mdi-plus"
                        tooltip="导入插件"
                        color="primary"
                        @click="handleCreate()"
                    ></ActionBtnComp>
                </template>
                <template #item.PluginType="{ item }">
                    <g-link :to="{ name: 'hango.server.info', query: { Id: item.Id } }">{{ item.PluginType }}</g-link>
                </template>
                <template #item.PluginCategory="{ item }">
                    {{ item.PluginCategory | type }}
                </template>
                <template #item.PluginScope="{ item }">
                    <v-chip
                        small
                        color="primary"
                        style="margin-right:4px;"
                        v-for="(scope, index) in item.PluginScope.split(',').sort()"
                    >
                        {{ scope |  PluginScope }}
                    </v-chip>
                </template>
                <template #item.PluginStatus="{ item }">
                    <v-chip
                        small
                        :color="item.PluginStatus === 'online' ? 'success' : ''"
                        label
                    >
                        {{ item.PluginStatus === 'online' ? '已上架' : '未上架' }}
                    </v-chip>
                </template>
            </g-table-list>
        </div>
    </v-container>
</template>
<script>
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
const TABLE_HEADERS = [
    { text: '插件名称', value: 'custom', name: 'PluginType' },
    { text: '中文名称', name: 'PluginName' },
    { text: '类型', value: 'custom', name: 'PluginCategory' },
    { text: '作用域', value: 'custom', name: 'PluginScope' },
    { text: '状态', value: 'custom', name: 'PluginStatus' },
    { text: '更新时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 120 },
];
export default {
    components: { ActionBtnComp },
    data() {
        return {
            headers: TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
        };
    },
    filters: {
        type(val) {
            switch (val) {
                case 'security': return '安全防护';
                case 'auth': return '认证鉴权';
                case 'trafficPolicy': return '流量管理';
                case 'dataFormat': return '数据转换';
                default:
                    return '-';
            }
        },
        PluginScope(val) {
            switch (val) {
                case 'routeRule':
                    return '路由';
                case 'service':
                    return '服务';
                case 'global':
                    return '项目';
                case 'host':
                    return 'Host';
                case 'gateway':
                    return '网关';
                default:
            }
            return '-';
        },
    },
    methods: {
        loadList(params) {
            return this.axios({
                action: 'DescribeCustomPluginList',
                data: {
                    ...params,
                },
            }).then(({ Result = [], TotalCount = 0 }) => {
                return { list: Result, total: TotalCount };
            });
        },
        handleCreate() {},
    },
};
</script>
<style></style>
