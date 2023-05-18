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
      >
        <template #top>
            <ActionBtnComp
                icon="mdi-plus"
                tooltip="创建路由"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template #item.Name="{ item }">
            <g-link :to="{ name: 'hango.router.info', query: { Id: item.Id } }">{{ item.Name }}</g-link>
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
        <template #item.ServiceMetaForRoute="{ item }">
            <v-chip
                small
                v-for="(service,index) in item.ServiceMetaForRoute"
                :key="index"
                >
                {{service.ServiceName}}
            </v-chip>
        </template>
        <template #item.EnableState="{ item }">
            <v-chip
                small
                :color="item.EnableState === 'enable' ? 'success' : ''"
                label
            >
                {{ item.EnableState === 'enable' ? '已启用' : '已禁用' }}
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
        <template #item.actions="{ item }">
            <ActionBtnComp
                color="primary"
                icon="mdi-pencil"
                tooltip="修改"
                @click="handleEdit(item)"
            ></ActionBtnComp>
            <ActionBtnComp
                v-if="[ 'webservice', 'dubbo' ].includes(item.ServiceMetaForRoute[0].Protocol)"
                color="primary"
                icon="mdi-protocol"
                tooltip="协议转换"
                @click="handleConvert(item)"
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
    <ConvertModelComp v-if="convertVisible" :current="current" @close="handleClose"/>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '路由名称', value: 'custom', name: 'Name' },
    { text: '路由别名', value: 'Alias' },
    { text: '匹配规则', value: 'custom', name: 'routeRuleInfo' }, // Uri、Headers、Host、Method
    { text: '目标网关', value: 'VirtualGwName' },
    { text: '目标服务', value: 'custom', name: 'ServiceMetaForRoute' },
    { text: '状态', value: 'custom', name: 'EnableState' },
    { text: '更新时间', value: 'UpdateTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import ActionBtnComp from '@/components/ActionBtn';
import RouterRuleInfoComp from './RouterRuleInfo';
import CreateModalComp from './CreateModal';
import ConvertModelComp from './ConvertModel';
export default {
    components: { ActionBtnComp, RouterRuleInfoComp, CreateModalComp, ConvertModelComp },
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
            convertVisible: false,
            editVisible: false,
            current: null,
        };
    },
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeRouteList',
                params: {
                    ...params,
                },
            }).then(({ RouteList = [], TotalCount = 0 }) => {
                return { list: RouteList, total: TotalCount };
            });
        },
        handleClose() {
            this.createVisible = false;
            this.editVisible = false;
            this.convertVisible = false;
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
            const RouteId = item.Id;
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该路由?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteRoute',
                        params: {
                            RouteId,
                        },
                    }).then(() => {
                        this.$notify.success('删除成功');
                        this.refresh();
                    });
                },
            });
        },
        handleConvert(item) {
            this.current = item;
            this.convertVisible = true;
        },
    },
};
</script>
