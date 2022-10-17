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
        item-key="RouteRuleName"
        ref="tableRef"
        show-expand
      >
        <template #top>
            <ActionBtnComp
                icon="mdi-plus"
                tooltip="创建路由"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template #item.RouteRuleName="{ item }">
            <g-link :to="{ name: 'hango.router.info', query: { Id: item.RouteRuleId } }">{{ item.RouteRuleName }}</g-link>
        </template>
        <template #item.routeRuleInfo="{ item }">
            <v-tooltip bottom color="rgba(0,0,0,0)">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip
                        small
                        color="success"
                        outlined
                        v-bind="{ ...attrs }"
                        v-on="{ ...on }"
                        >
                        <v-icon left>mdi-routes</v-icon>
                        {{ item.Uri && item.Uri.Value && item.Uri.Value[0] || '-' }}
                    </v-chip>
                </template>
                <div>
                    <RouterRuleInfoComp border :data="item"/>
                </div>
            </v-tooltip>
        </template>
        <template #item.PublishStatus="{ item }">
            <v-chip
                small
                :color="+item.PublishStatus > 0 ? 'success' : ''"
                label
            >
                {{ +item.PublishStatus === 0 ? '未发布' : '已发布' }}
            </v-chip>
        </template>
        <template #item.ServiceName="{ item }">
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
            {{item.ServiceName}}
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
                :disabled="+item.PublishStatus !== 0"
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
    { text: '路由名称', value: 'custom', name: 'RouteRuleName' },
    { text: '路由信息', value: 'custom', name: 'routeRuleInfo' }, // Uri、Headers、Host、Method
    { text: '所属服务', value: 'custom', name: 'ServiceName' },
    { text: '发布状态', value: 'custom', name: 'PublishStatus' },
    // { text: '备注信息', value: 'Description' },
    { text: '创建时间', value: 'CreateTime' },
    { text: '修改时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import ActionBtnComp from '@/components/ActionBtn';
import RouterRuleInfoComp from './RouterRuleInfo';
import CreateModalComp from './CreateModal';
import PublishModalComp from './PublishModal';
export default {
    components: { ActionBtnComp, RouterRuleInfoComp, CreateModalComp, PublishModalComp },
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
                action: 'DescribeRouteRuleList',
                params: {
                    ...params,
                },
            }).then(({ RouteRuleList = [], TotalCount = 0 }) => {
                return { list: RouteRuleList, total: TotalCount };
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
            const RouteRuleId = item.RouteRuleId;
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该路由?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteRouteRule',
                        params: {
                            RouteRuleId,
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
