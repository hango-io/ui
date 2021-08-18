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
                tooltip="创建网关"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template #item.HostList="{ item }">
            <v-tooltip top min-width="320">
                <template v-slot:activator="{ on, attrs }">
                    <span>{{ Array.isArray(item.HostList) && item.HostList[0] || '-' }}</span>
                    <v-btn
                        v-if="Array.isArray(item.HostList) && item.HostList.length > 1"
                        class="ml-2"
                        style="vertical-align: bottom;"
                        x-small
                        text
                        color="primary"
                        v-bind="{ ...attrs, ...$attrs }"
                        v-on="{ ...on, ...$listeners }"
                    >更多</v-btn>
                </template>
                <div v-if="Array.isArray(item.HostList) && item.HostList.length > 1">
                    <div v-for="(host, i) in item.HostList" :key="i">{{ host || '-' }}</div>
                </div>
            </v-tooltip>
        </template>
        <template #item.actions="{ item }">
            <ActionBtnComp
                color="primary"
                icon="mdi-pencil"
                tooltip="修改"
                @click="handleEdit(item)"
            ></ActionBtnComp>
            <!-- <ActionBtnComp
                color="error"
                icon="mdi-delete"
                tooltip="删除"
                @click="handleDelete(item)"
            ></ActionBtnComp> -->
        </template>
      </g-table-list>
    </div>
    <CreateModalComp v-if="createVisible" :current="current" @close="handleClose"/>
    <CreateModalComp v-if="editVisible" :current="current" type="edit" @close="handleClose"/>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '网关名称', value: 'GwName' },
    { text: '网关地址', value: 'GwAddr' },
    { text: '域名列表', value: 'custom', name: 'HostList' },
    { text: '备注信息', value: 'Description' },
    { text: '操作', value: 'custom', name: 'actions', width: 120 },
];
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import CreateModalComp from './CreateModal';
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
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeGatewayListForGatewayTab',
                params: {
                    ...params,
                },
            }).then(({ GatewayInfos = [], GatewayCount = 0 }) => {
                return { list: GatewayInfos, total: GatewayCount };
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
        handleDelete(item) {
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该网关?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteService',
                        params: {
                            ..._.pick(item, [
                                'RouteRuleId',
                                'GwId',
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
