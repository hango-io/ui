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
            <ActionBtnComp
                color="primary"
                icon="mdi-heart"
                tooltip="健康检查"
                @click="handleHealth(item)"
            ></ActionBtnComp>
            <!-- <ActionBtnComp
                color="success"
                icon="mdi-compare"
                tooltip="复制发布"
                @click="handleCopyPublish(item)"
            ></ActionBtnComp> -->
        </template>
      </g-table-list>
    </div>
    <HealthModalComp v-if="healthVisible" :current="current" @close="handleClose"/>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '服务名称', value: 'custom', name: 'ServiceName' },
    { text: '服务标识', value: 'custom', name: 'ServiceTag' },
    { text: '发布信息', value: 'custom', name: 'PublishType' },
    { text: '所属网关', value: 'VirtualGwName' },
    { text: '发布时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import HealthModalComp from './HealthModal';
export default {
    components: { ActionBtnComp, HealthModalComp },
    data() {
        return {
            headers: TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
            healthVisible: false,
            current: null,
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
        handleClose() {
            this.healthVisible = false;
            this.current = null;
            this.refresh();
        },
        handleEdit(item) {
            console.info(item);
            this.current = item;
        },
        handleHealth(item) {
            this.current = item;
            this.healthVisible = true;
        },
        handleCopyPublish(item) {
            console.info(item);
            this.current = item;
        },
        handleDelete(item) {
            console.log(item);
            this.$confirm({
                title: '操作确认提示',
                message: '下线操作将会导致服务不可用，请谨慎操作！',
                ok: () => {
                    return this.axios({
                        action: 'DeleteServiceProxy',
                        params: {
                            ..._.pick(item, [
                                'ServiceId',
                                'VirtualGwId',
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
