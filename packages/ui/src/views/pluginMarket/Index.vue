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
                        @click="$router.push({ name: 'hango.pluginMarket.upload' })"
                    ></ActionBtnComp>
                </template>
                <template #item.PluginType="{ item }">
                    <g-link :to="{ name: 'hango.pluginMarket.info', query: { Id: item.Id } }">{{ item.PluginType }}</g-link>
                </template>
                <template #item.PluginCategory="{ item }">
                    {{ TYPE_TEXT[item.PluginCategory] }}
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
                <template template #item.actions="{ item }">
                    <ActionBtnComp
                        color="primary"
                        icon="mdi-pencil"
                        tooltip="修改"
                        @click="$router.push({ name: 'hango.pluginMarket.upload', query: {Id: item.Id} })"
                    ></ActionBtnComp>
                    <ActionBtnComp
                        color="primary"
                        v-if="item.PluginStatus === 'offline'"
                        icon="mdi-arrow-expand-up"
                        tooltip="上架"
                        @click="handleUpdateStatus(item)"
                    ></ActionBtnComp>
                    <ActionBtnComp
                        color="primary"
                        v-else
                        icon="mdi-arrow-expand-down"
                        tooltip="下架"
                        @click="handleUpdateStatus(item)"
                    ></ActionBtnComp>
                    <ActionBtnComp
                        color="error"
                        icon="mdi-delete"
                        tooltip="删除"
                        @click="handleDelete(item)"
                    ></ActionBtnComp>
                </template>
            </g-table-list>
        </div>
    </v-container>
</template>
<script>
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import { TYPE_TEXT, PluginScope } from './config.js';
const TABLE_HEADERS = [
    { text: '插件名称', value: 'custom', name: 'PluginType' },
    { text: '中文名称', value: 'PluginName' },
    { text: '类型', value: 'custom', name: 'PluginCategory' },
    { text: '作用域', value: 'custom', name: 'PluginScope' },
    { text: '状态', value: 'custom', name: 'PluginStatus' },
    { text: '更新时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 150 },
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
            TYPE_TEXT,
        };
    },
    filters: {
        PluginScope,
    },
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
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
        handleEdit(item) {
            this.current = item;
            this.editVisible = true;
        },
        handleDelete(item) {
            const Id = item.Id;
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该插件?',
                ok: () => {
                    return this.axios({
                        action: 'DeletePlugin',
                        params: {
                            Id,
                        },
                    }).then(() => {
                        this.$notify.success('删除成功');
                        this.refresh();
                    });
                },
            });
        },
        handleUpdateStatus(item) {
            const Id = item.Id;
            const text = item.PluginStatus === 'offline' ? '上架' : '下架';
            this.$confirm({
                title: `${text}确认提示`,
                message: `警告，是否${text}该插件?`,
                ok: () => {
                    return this.axios({
                        action: 'UpdatePluginStatus',
                        data: {
                            Id,
                            PluginStatus: item.PluginStatus === 'online' ? 'offline' : 'online',
                        },
                    }).then(() => {
                        this.$notify.success(`${text}成功`);
                        this.refresh();
                    });
                },
            });
        },
    },
};
</script>
<style></style>
