<template>
    <v-container fluid>
        <v-breadcrumbs class="pl-3" v-if="$route.meta && $route.meta.breadcrumbs" large :items="$route.meta.breadcrumbs">
        </v-breadcrumbs>
        <div v-if="info">
            <v-card class="mx-auto mb-4">
                <v-list-item two-line>
                    <v-list-item-avatar tile size="54">
                        <v-avatar color="secondary" size="54">
                            <span class="white--text text-h5">{{
                                info.PluginType.substring(0, 1).toUpperCase()
                            }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.PluginType }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row justify="center">
                                <v-col>
                                    <g-label>状态：</g-label>
                                    <v-chip v-if="info.PluginStatus === 'online'" color="indigo" text-color="white" label
                                        x-small>
                                        上架
                                    </v-chip>
                                    <v-chip v-else color="info" text-color="white" label x-small>
                                        下架
                                    </v-chip>
                                    <g-label class="ml-4">实现语言:</g-label>
                                    {{ info.Language }}
                                    <g-label class="ml-4">插件描述:</g-label>
                                    {{ info.Description }}
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-row id="baseInfo">
                <!-- 基础信息 -->
                <v-col>
                    <g-info-card title="基础信息" :list="basicInfoList">
                        <template #PluginStatus="{ item }">
                            <v-chip v-if="info.PluginStatus === 'online'" color="indigo" text-color="white" label
                                x-small>上架</v-chip>
                            <v-chip v-else color="info" text-color="white" label x-small>下架</v-chip>
                        </template>
                        <template #PluginScope="{ item }">
                            <v-chip
                                small
                                color="primary"
                                style="margin-right:4px;"
                                v-for="(scope, index) in info.PluginScope.split(',').sort()"
                            >
                                {{ scope |  PluginScope }}
                            </v-chip>
                        </template>  
                        <template #SourceContent="{ item }">
                            <v-btn @click="downLoad" v-if="info.SourceContent">点击下载</v-btn>
                            <span v-else-if="info.SourceUrl">{{info.SourceUrl}}</span>
                        </template>
                    </g-info-card>
                </v-col>
            </v-row>
            <v-row id="instance">
                <v-col>
                    <g-info-card title="插件实例">
                        <g-table-list ref="instanceList" :headers="instanceHeaders" :load="getInstanceFromApi" hide-default-footer>
                            <template #header>
                                <div class="ml-4"></div>
                            </template>
                            <template #item.PluginBindingInfoId="{ item }">
                                <v-chip
                                    small
                                    outlined
                                    color="orange"
                                    @click="handleEdit(item)"
                                >
                                    {{ item.PluginBindingInfoId }}
                                </v-chip>
                            </template>
                            <template #item.BindingObjectType="{ item }">
                                <v-chip
                                    small
                                    color="primary"
                                    style="margin-right:4px;"
                                    v-for="(scope, index) in item.BindingObjectType.split(',').sort()"
                                >
                                    {{ scope |  PluginScope }}
                                </v-chip>
                            </template>
                            <template #item.BindingStatus="{ item }">
                                <v-icon v-if="item.BindingStatus === 'enable'" color="green darken-2">mdi-check-circle</v-icon>
                                <v-icon v-else color="red darken-2">mdi-close-circle</v-icon>
                            </template>
                            <template template #item.actions="{ item }">
                                <ActionBtnComp
                                    :color="item.BindingStatus !== 'enable' ? 'success' : 'warning'"
                                    :icon="item.BindingStatus !== 'enable' ? 'mdi-check-circle' : 'mdi-cancel'"
                                    :tooltip="item.BindingStatus !== 'enable' ? '启用' : '禁用'"
                                    @click="handleChangeStatus(item, item.BindingStatus !== 'enable')"
                                ></ActionBtnComp>
                                <ActionBtnComp
                                    color="error"
                                    icon="mdi-delete"
                                    tooltip="删除"
                                    @click="handleDelete(item)"
                                ></ActionBtnComp>
                            </template>
                        </g-table-list>
                    </g-info-card>
                </v-col>
            </v-row>
        </div>
        <BindModalComp scope="routeRule" v-if="pluginVisible" type="edit" :current="current" @close="pluginVisible = false"></BindModalComp>
    </v-container>
</template>
<script>
import { TYPE_TEXT, PluginScope } from './config.js';
import ActionBtnComp from '@/components/ActionBtn';
import BindModalComp from '../Plugins/BindModal';
import _ from 'lodash';
const INSTANCE_HEADERS = [
    { text: '插件ID', value: 'custom', name: 'PluginBindingInfoId' },
    { text: '作用域', value: 'custom', name: 'BindingObjectType' },
    { text: '作用对象', value: 'BindingObjectName' },
    { text: '所属网关', value: 'VirtualGwName' },
    { text: '状态', value: 'custom', name: 'BindingStatus' },
    { text: '更新时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 120 },
];
export default {
    components: { ActionBtnComp, BindModalComp },
    data() {
        return {
            info: null,
            TYPE_TEXT,
            instanceHeaders: INSTANCE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
            current: {},
            pluginVisible: false,
        };
    },
    filters: {
        PluginScope,
    },
    computed: {
        basicInfoList() {
            const info = this.info || {};
            return [
                { label: '插件名称', text: info.PluginType },
                { label: '类型', text: TYPE_TEXT[info.PluginCategory] },
                { label: '中文名称', text: info.PluginName },
                { label: '状态', key: 'PluginStatus', text: info.PluginStatus },
                { label: '实现语言', text: info.Language },
                { label: '作用域', key: 'PluginScope', text: info.PluginScope },
                { label: '插件代码/镜像', key: 'SourceContent', text: '点击下载' },
                { label: '负责人', text: info.Author },
                { label: '创建时间', key: 'CreateTime', text: info.CreateTime },
                { label: '更新时间', key: 'UpdateTime', text: info.UpdateTime },
                { label: '插件描述', text: info.Description },
            ];
        },
    },
    methods: {
        loadInfo() {
            const { Id } = this.$route.query || {};
            if (!Id) {
                return this.$router.replace(
                    (this.$route.meta &&
                        this.$route.meta.breadcrumbs &&
                        this.$route.meta.breadcrumbs[0].to) ||
                    '/'
                );
            }
            return this.axios({
                action: 'DescribeCustomPluginInfo',
                params: {
                    Id,
                },
            }).then(({ Result = {} }) => {
                this.info = Result;
            });
        },
        downLoad() {
            // 将字符串转换为 Blob 对象
            const blob = new Blob([ this.info.SourceContent ], { type: 'text/plain' });

            // 创建下载链接并模拟点击下载
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${this.info.PluginType}.lua`;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // 释放资源
            URL.revokeObjectURL(downloadLink.href);
            document.body.removeChild(downloadLink);
        },
        getInstanceFromApi(params) {
            const { Id } = this.$route.query || {};
            return this.axios({
                action: 'DescribeCustomPluginInstanceList',
                data: {
                    ...params,
                    pluginId: Id,
                },
            }).then(({ Result = [] }) => {
                return { list: Result, total: Result.length };
            });
        },
        refreshInstanceList() {
            this.$refs.instanceList && this.$refs.instanceList.refresh();
        },
        handleChangeStatus(item, isEnableFlag) {
            this.$confirm({
                title: isEnableFlag ? '启用确认提示' : '禁用确认提示',
                message: '警告，是否' + (isEnableFlag ? '启用' : '禁用') + '该插件?',
                ok: () => {
                    return this.axios({
                        action: 'UpdatePluginBindingStatus',
                        params: {
                            ..._.pick(item, [
                                'PluginBindingInfoId',
                            ]),
                            BindingStatus: isEnableFlag ? 'enable' : 'disable',
                        },
                    }).then(() => {
                        this.$notify.success('操作成功');
                        this.refreshInstanceList();
                    });
                },
            });
        },
        handleDelete(item) {
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该插件?',
                ok: () => {
                    return this.axios({
                        action: 'UnbindingPlugin',
                        params: {
                            ..._.pick(item, [
                                'PluginBindingInfoId',
                            ]),
                        },
                    }).then(() => {
                        this.$notify.success('删除成功');
                        this.refreshInstanceList();
                    });
                },
            });
        },
        handleEdit(item) {
            this.current = item;
            this.pluginVisible = true;
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
