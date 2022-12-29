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
                        tooltip="创建虚拟网关"
                        color="primary"
                        @click="handleCreate()"
                    ></ActionBtnComp>
                </template>
                <template #item.Name="{ item }">
                    <g-link :to="{ name: 'hango.virtualManager.info', query: { Id: item.RouteRuleId } }">{{ item.Name }}</g-link>
                </template>
                <template #item.actions="{ item }">
                    <ActionBtnComp
                        color="primary"
                        icon="mdi-pencil"
                        tooltip="修改"
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
        <CreateModalComp v-if="createVisible" :current="current" @close="handleClose" />
        <CreateModalComp v-if="editVisible" :current="current" type="edit" @close="handleClose" />
    </v-container>
</template>

<script>
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import CreateModalComp from './CreateModal';
const TABLE_HEADERS = [
    { text: '虚拟网关名称', value: 'Name' },
    { text: '类型', value: 'GwType' },
    { text: '所属网关', value: 'GwName' },
    { text: '监听协议', value: 'Protocol' },
    { text: '监听端口', value: 'Port' },
    { text: '操作', value: 'custom', name: 'actions', width: 120 },
];
export default {
    components: { ActionBtnComp, CreateModalComp },
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
        handleCreate() {
            this.current = null;
            this.createVisible = true;
        },
        handleClose() {
            this.createVisible = false;
            this.editVisible = false;
            this.current = null;
            this.refresh();
        },
        handleEdit(item) {
            this.current = item;
            this.editVisible = true;
        },
        handleDelete() {},
        getDataFromApi(params = {}) {
            return this.axios({
                action: 'DescribeVirtualGateway',
                data: {
                    ...params,
                    Pattern: '',
                    ProjectIdList: null,
                },
            }).then(({ Result = [], TotalCount = 0 }) => {
                return { list: Result, total: TotalCount };
            });
        },
    },
};
</script>

<style></style>
