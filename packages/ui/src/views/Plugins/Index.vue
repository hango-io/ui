<template>
  <v-container fluid>
    <v-breadcrumbs
        class="pl-3"
        v-if="$route.meta && $route.meta.breadcrumbs"
        large
        :items="$route.meta.breadcrumbs"
    ></v-breadcrumbs>
    <div>
      <g-table-list
        :headers="headers"
        :load="getDataFromApi"
        ref="tableRef"
      >
        <template #top>
            <ActionBtnComp
                icon="mdi-plus"
                tooltip="添加插件"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template v-slot:item.BindingStatus="{ item }">
            <v-chip
                small
                :color="item.BindingStatus === 'enable' ? 'success' : 'error'"
                label
            >
                {{ item.BindingStatus !== 'enable' ? '已禁用' : '已启用' }}
            </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
            <ActionBtnComp
                :color="item.BindingStatus !== 'enable' ? 'success' : 'warning'"
                :icon="item.BindingStatus !== 'enable' ? 'mdi-check-circle' : 'mdi-cancel'"
                :tooltip="item.BindingStatus !== 'enable' ? '启用' : '禁用'"
                @click="handleChangeStatus(item, item.BindingStatus !== 'enable')"
            ></ActionBtnComp>
            <ActionBtnComp
                color="primary"
                icon="mdi-pencil"
                tooltip="更新"
                @click="handleEdit(item)"
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
    <CreateModalComp scope="routeRule" v-if="createVisible" :current="current" @close="handleClose"/>
    <BindModalComp scope="routeRule" v-if="editVisible" type="edit" :current="current" @close="handleClose"></BindModalComp>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '插件ID', value: 'PluginBindingInfoId' },
    { text: '插件名称', value: 'PluginName' },
    // { text: '作用域', value: 'custom', name: 'BindingObjectType' },
    { text: '目标已发布路由', value: 'BindingObjectName' },
    { text: '状态', value: 'custom', name: 'BindingStatus' },
    { text: '创建时间', value: 'CreateTime' },
    { text: '修改时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import CreateModalComp from './CreateModal';
import BindModalComp from './BindModal';
export default {
    components: { ActionBtnComp, CreateModalComp, BindModalComp },
    data() {
        return {
            headers: TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
            createVisible: false,
            editVisible: false,
        };
    },
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeBindingPlugins',
                params: {
                    ...params,
                },
            }).then(({ PluginBindingList = [], TotalCount = 0 }) => {
                return { list: PluginBindingList, total: TotalCount };
            });
        },
        handleClose() {
            this.createVisible = false;
            this.editVisible = false;
            this.current = null;
            this.refresh();
        },
        handleCreate() {
            this.current = null;
            this.createVisible = true;
        },
        handleEdit(item) {
            this.current = item;
            this.editVisible = true;
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
                        this.refresh();
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
                        this.refresh();
                    });
                },
            });
        },
    },
};
</script>
