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
        item-key="ServiceTag"
        ref="tableRef"
      >
        <template #top>
            <ActionBtnComp
                icon="mdi-plus"
                tooltip="创建服务"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template #item.Name="{ item }">
            <g-link :to="{ name: 'hango.server.info', query: { Id: item.Id } }">{{ item.Name }}</g-link>
        </template>
        <template #item.Alias="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-chip
                        v-bind="attrs"
                        v-on="on"
                        :color="item.Protocol === 'dubbo' ? 'indigo' : 'info'"
                        text-color="white"
                        x-small
                        label
                    >
                        {{ item.Protocol.substr(0,1).toUpperCase() || '-' }}
                    </v-chip>
                </template>
                <span>{{ item.Protocol.toUpperCase() }}</span>
            </v-tooltip>
            {{item.Alias}}
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
                            <span>注册中心</span>
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
            <ActionBtnComp
                color="primary"
                icon="mdi-heart"
                tooltip="健康检查"
                @click="handleHealth(item)"
            ></ActionBtnComp>
        </template>
      </g-table-list>
    </div>
    <CreateModalComp v-if="createVisible" :current="current" @close="handleClose"/>
    <CreateModalComp v-if="editVisible" :current="current" type="edit" @close="handleClose"/>
    <HealthModalComp v-if="healthVisible" :current="current" @close="handleClose"/>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '服务名称', value: 'custom', name: 'Name' },
    { text: '服务别名', value: 'custom', name: 'Alias' },
    { text: '发布信息', value: 'custom', name: 'PublishType' },
    { text: '所属网关', value: 'VirtualGwName' },
    { text: '更新时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import ActionBtnComp from '@/components/ActionBtn';
import CreateModalComp from './CreateModal';
import HealthModalComp from './HealthModal';

export default {
    components: { ActionBtnComp, CreateModalComp, HealthModalComp },
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
                action: 'DescribeServiceList',
                params: {
                    ...params,
                },
            }).then(({ Result = [], TotalCount = 0 }) => {
                return { list: Result, total: TotalCount };
            });
        },
        handleClose() {
            this.createVisible = false;
            this.editVisible = false;
            this.publishVisible = false;
            this.healthVisible = false;
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
        handleHealth(item) {
            this.current = item;
            this.healthVisible = true;
        },
        handleDelete(item) {
            const Id = item.Id;
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该服务?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteService',
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
    },
};
</script>
