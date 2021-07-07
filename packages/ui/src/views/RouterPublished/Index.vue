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
        <template #item.RouteRuleName="{ item }">
            <g-link :to="{ name: 'hango.published.router.info', query: { Id: item.RouteRuleId } }">{{ item.RouteRuleName }}</g-link>
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
        <template v-slot:item.EnableState="{ item }">
            <v-chip
                small
                :color="item.EnableState === 'enable' ? 'success' : 'error'"
                label
            >
                {{ item.EnableState !== 'enable' ? '已禁用' : '已启用' }}
            </v-chip>
        </template>
        <template v-slot:item.Priority="{ item }">
            <v-chip
                small
                color="primary"
                label
            >
                {{ item.Priority }}
            </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
            <!-- <ActionBtnComp
                color="success"
                icon="mdi-publish"
                tooltip="发布更新"
                @click="handlePublishUpdate(item)"
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
    <PublishModalComp v-if="publishVisible" :current="current" type="edit" @close="handleClose"/>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '路由名称', value: 'custom', name: 'RouteRuleName' },
    { text: '路由信息', value: 'custom', name: 'routeRuleInfo' }, // Uri、Headers、Host、Method
    { text: '所属服务', value: 'ServiceName' },
    { text: '使能状态', value: 'custom', name: 'EnableState' },
    { text: '优先级', value: 'custom', name: 'Priority' },
    { text: '发布时间', value: 'CreateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 120 },
];
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import RouterRuleInfoComp from '@/views/Router/RouterRuleInfo';
import PublishModalComp from '@/views/Router/PublishModal';
export default {
    components: { ActionBtnComp, RouterRuleInfoComp, PublishModalComp },
    data() {
        return {
            headers: TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
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
                action: 'DescribePublishRouteRuleList',
                params: {
                    ...params,
                },
            }).then(({ RouteRuleProxyList = [], TotalCount = 0 }) => {
                return { list: RouteRuleProxyList, total: TotalCount };
            });
        },
        handleClose() {
            this.publishVisible = false;
            this.current = null;
            this.refresh();
        },
        handlePublishUpdate(item) {
            console.info(item);
            this.current = item;
            this.publishVisible = true;
        },
        handleDelete(item) {
            this.$confirm({
                title: '操作确认提示',
                message: '下线操作将会导致该路由关联的服务不可访问，请谨慎操作！',
                ok: () => {
                    return this.axios({
                        action: 'DeletePublishedRouteRule',
                        params: {
                            ..._.pick(item, [
                                'RouteRuleId',
                                'GwId',
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
