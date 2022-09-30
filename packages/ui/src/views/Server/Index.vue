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
        show-expand
      >
        <template #top>
            <ActionBtnComp
                icon="mdi-plus"
                tooltip="创建服务"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template #item.ServiceName="{ item }">
            <g-link :to="{ name: 'hango.server.info', query: { Id: item.ServiceId } }">{{ item.ServiceName }}</g-link>
        </template>
        <template #item.ServiceTag="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-chip
                        v-bind="attrs"
                        v-on="on"
                        :color="item.ServiceType === 'dubbo' ? 'indigo' : 'info'"
                        text-color="white"
                        x-small
                        label
                    >
                        {{ item.ServiceType.substr(0,1).toUpperCase() || '-' }}
                    </v-chip>
                </template>
                <span>{{ item.ServiceType.toUpperCase() }}</span>
            </v-tooltip>
            {{item.ServiceTag}}
        </template>
        <template #item.PublishedStatus="{ item }">
            <v-chip
                small
                :color="+item.PublishedStatus > 0 ? 'success' : ''"
                label
            >
                {{ +item.PublishedStatus === 0 ? '未发布' : '已发布' }}
            </v-chip>
        </template>
        <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                <g-label>备注信息：</g-label>
                <div style="word-break: break-all;">{{ item.Description }}</div>
            </td>
        </template>
        <template #item.actions="{ item }">
            <ActionBtnComp
                color="primary"
                icon="mdi-pencil"
                tooltip="修改"
                @click="handleEdit(item)"
            ></ActionBtnComp>
            <ActionBtnComp
                color="success"
                icon="mdi-publish"
                tooltip="发布"
                @click="handlePublish(item)"
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
    <CreateModalComp v-if="createVisible" :current="current" @close="handleClose"/>
    <CreateModalComp v-if="editVisible" :current="current" type="edit" @close="handleClose"/>
    <PublishModalComp v-if="publishVisible" :current="current" @close="handleClose"/>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '服务名称', value: 'custom', name: 'ServiceName' },
    { text: '服务标识', value: 'custom', name: 'ServiceTag' },
    { text: '发布状态', value: 'custom', name: 'PublishedStatus' },
    { text: '创建时间', value: 'CreateDate' },
    { text: '修改时间', value: 'ModifyDate' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import ActionBtnComp from '@/components/ActionBtn';
import CreateModalComp from './CreateModal';
import PublishModalComp from './PublishModal';
export default {
    components: { ActionBtnComp, CreateModalComp, PublishModalComp },
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
            publishVisible: false,
            current: null,
        };
    },
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeServiceList',
                params: {
                    ...params,
                },
            }).then(({ ServiceInfoList = [], ServiceCount = 0 }) => {
                return { list: ServiceInfoList, total: ServiceCount };
            });
        },
        handleClose() {
            this.createVisible = false;
            this.editVisible = false;
            this.publishVisible = false;
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
        handlePublish(item) {
            this.current = item;
            this.publishVisible = true;
        },
        handleDelete(item) {
            const ServiceId = item.ServiceId;
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该服务?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteService',
                        params: {
                            ServiceId,
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
