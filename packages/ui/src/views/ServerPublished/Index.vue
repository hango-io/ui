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
        <template #item.ServiceName="{ item }">
            <g-link :to="{ name: 'hango.published.server.info', query: { Id: item.ServiceId, gwId: item.GwId } }">{{ item.ServiceName }}</g-link>
        </template>
        <template #item.PublishType="{ item }">
            <v-tooltip top min-width="320">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip
                        small
                        color="success"
                        outlined
                        v-bind="{ ...attrs }"
                        v-on="{ ...on }"
                        >
                        <template v-if="item.PublishType === 'DYNAMIC'">
                            <span>从注册中心同步</span>
                        </template>
                        <template v-else-if="item.PublishType === 'STATIC'">
                            <span>静态地址</span>
                        </template>
                    </v-chip>
                </template>
                <div>
                    <span>{{ item.BackendService || '-' }}</span>
                </div>
            </v-tooltip>
        </template>
        <template #item.actions="{ item }">
            <!-- <ActionBtnComp
                color="success"
                icon="mdi-publish"
                tooltip="发布更新"
                @click="handlePublish(item)"
            ></ActionBtnComp> -->
            <ActionBtnComp
                color="error"
                icon="mdi-delete"
                tooltip="下线"
                @click="handleDelete(item)"
            ></ActionBtnComp>
        </template>
      </g-table-list>
    </div>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '服务名称', value: 'custom', name: 'ServiceName' },
    { text: '服务标识', value: 'ServiceTag' },
    { text: '发布信息', value: 'custom', name: 'PublishType' },
    { text: '所属网关', value: 'GwName' },
    { text: '发布时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 50 },
];
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
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
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeEnvoyServiceProxyList',
                params: {
                    ...params,
                },
            }).then(({ ServiceProxyList = [], TotalCount = 0 }) => {
                return { list: ServiceProxyList, total: TotalCount };
            });
        },
        handleEdit(item) {
            console.info(item);
        },
        handlePublish(item) {
            console.info(item);
        },
        handleDelete(item) {
            this.$confirm({
                title: '操作确认提示',
                message: '下线操作将会导致服务不可用，请谨慎操作！',
                ok: () => {
                    return this.axios({
                        action: 'DeleteServiceProxy',
                        params: {
                            ..._.pick(item, [
                                'ServiceId',
                                'GwId',
                                'BackendService',
                                'PublishType',
                            ]),
                        },
                    }).then(() => {
                        this.$notify.success('下线成功');
                        this.refresh();
                    });
                },
            });
        },
    },
};
</script>
