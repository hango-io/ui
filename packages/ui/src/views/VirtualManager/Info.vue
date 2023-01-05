<template>
    <v-container fluid>
        <v-breadcrumbs class="pl-3" v-if="$route.meta && $route.meta.breadcrumbs" large :items="$route.meta.breadcrumbs"></v-breadcrumbs>
        <div>
            <v-card class="mx-auto mb-4">
                <v-list-item two-line>
                    <v-list-item-avatar tile size="54">
                        <v-avatar color="secondary" size="54">
                            <span class="white--text text-h5">
                                {{
                                info.Name && info.Name.substring(0, 2).toUpperCase()
                                }}
                            </span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.Name }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row justify="center">
                                <v-col>
                                    <g-label>类型:</g-label>
                                    {{ (info.Type && apiType) || "-" }}
                                    <g-label class="ml-4">监听协议:</g-label>
                                    {{ info.Protocol || "-" }}
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-row>
                <!-- 基础信息 -->
                <v-col>
                    <g-info-card title="基础信息" :list="basicInfoList"></g-info-card>
                </v-col>
            </v-row>
            <v-row>
                <!-- 域名管理 -->
                <v-col>
                    <g-info-card title="域名管理">
                        <template #extra>
                            <v-icon color="secondary" @click="editDomain">mdi-plus</v-icon>
                        </template>
                        <g-table-list :headers="domainheaders" :load="getDomainFromApi" hide-default-footer></g-table-list>
                    </g-info-card>
                </v-col>
            </v-row>
            <template v-if="info.Type =='KubernetesGateway'">
                <v-row>
                    <!-- gateway -->
                    <v-col>
                        <g-info-card title="Gateway">
                            <template #extra>
                                <div :class="$style.color" @click="openYaml">查看yaml</div>
                            </template>
                            <g-table-list :headers="headers" :load="getDataFromApi" hide-default-footer>
                                <template #header>
                                    <div class="ml-4">{{ "" }}</div>
                                </template>
                                <template #item.pluginBindingDtos="{ item }">
                                    <template v-if="item.pluginBindingDtos.length > 0">
                                        <v-chip
                                            class="mr-2"
                                            x-small
                                            color="primary"
                                            label
                                            v-for="value in item.pluginBindingDtos"
                                            :key="value.PluginBindingInfoId"
                                        >{{ value.PluginName || "-" }}</v-chip>
                                    </template>
                                    <template v-else>{{ "-" }}</template>
                                </template>
                            </g-table-list>
                        </g-info-card>
                    </v-col>
                </v-row>
                <v-row>
                    <!-- http route -->
                    <v-col>
                        <g-info-card title="HTTP Route">
                            <template #extra>
                                <v-icon color="secondary" @click="getHttpFromApi">mdi-reload</v-icon>
                            </template>
                            <g-info-card :title="`HTTP Route Name:'${routeName}`">
                                <template #extra>
                                    <div class="mr-4" :class="$style.color">{{ "查看yaml" }}</div>
                                </template>
                                <g-table-list :headers="httpheaders" :load="getHttpFromApi" hide-default-footer>
                                    <template #header>
                                        <div class="ml-4">{{`Host:${routeHosts}`}}</div>
                                    </template>
                                    <template #item.matches="{ item }">
                                        <div v-for="(data, index) in item.rules" :key="index">
                                            <template v-if="data.matches.length > 0">
                                                <div v-for="(match, index) in data.matches" :key="index">
                                                    <v-chip
                                                        class="mr-2"
                                                        x-small
                                                        color="green"
                                                        text-color="white"
                                                        label
                                                    >{{ match.type | type }}</v-chip>
                                                    <v-tooltip top>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-chip class="mr-2" x-small label v-bind="attrs" v-on="on">{{ match.value }}</v-chip>
                                                        </template>
                                                        <span>{{ match.value }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip top>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon v-bind="attrs" v-on="on" color="blue">mdi-dots-horizontal</v-icon>
                                                        </template>
                                                        <span>详细路由信息请查看yaml</span>
                                                    </v-tooltip>
                                                </div>
                                            </template>
                                            <template v-else>{{ "-" }}</template>
                                        </div>
                                    </template>
                                    <template #item.backendRefs="{ item }">
                                        <div v-for="(data, index) in item.rules" :key="index">
                                            <span
                                                v-for="(backend, index) in data.backendRefs"
                                                :key="index"
                                            >{{ backend.name || "-" }}:{{ backend.port || "-" }}</span>
                                        </div>
                                    </template>
                                    <template #item.filters="{ item }">
                                        <div v-for="(data, index) in item.rules" :key="index">
                                            <template v-if="data.filters.length > 0">
                                                <v-chip
                                                    class="mr-2"
                                                    x-small
                                                    color="primary"
                                                    label
                                                    v-for="(filter, index) in data.filters"
                                                    :key="index"
                                                >{{ filter.type || "-" }}</v-chip>
                                            </template>
                                            <template v-else>{{ "-" }}</template>
                                        </div>
                                    </template>
                                </g-table-list>
                            </g-info-card>
                        </g-info-card>
                    </v-col>
                </v-row>
            </template>
            <v-row>
                <!-- 插件配置 -->
                <v-col>
                    <g-info-card title="插件配置">
                        <g-table-list :headers="pluginheaders" :load="getPluginFromApi" hide-default-footer>
                            <template #header>
                                <div class="ml-4"></div>
                            </template>
                            <template #item.Enable="{ item }">
                                <v-icon v-if="item.Enable" color="green darken-2">mdi-check-circle</v-icon>
                                <v-icon v-else color="red darken-2">mdi-close-circle</v-icon>
                            </template>
                            <template #item.actions="{ item }">
                                <v-switch @click="handleEnabled(item)" v-model="item.Enable"></v-switch>
                            </template>
                        </g-table-list>
                    </g-info-card>
                </v-col>
            </v-row>
        </div>
        <!-- <v-dialog
      :value="visible"
      @input="handleClose"
      persistent
      :max-width="maxWidth"
      v-bind="$attrs"
    >
        </v-dialog>-->
    </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: 'Hostname', value: 'Hostname' },
    { text: 'Plugin', value: 'custom', name: 'pluginBindingDtos' },
];
const HTTP_TABLE_HEADERS = [
    { text: 'rule match', value: 'custom', name: 'matches' },
    { text: 'backend', value: 'custom', name: 'backendRefs' },
    { text: 'filter', value: 'custom', name: 'filters' },
];
const PLUGIN_HEADERS = [
    { text: '插件名称', value: 'DisplayName' },
    { text: '状态', value: 'custom', name: 'Enable' },
    { text: '操作', value: 'custom', name: 'actions', width: 120 },
];
export default {
    data() {
        return {
            info: {
                ApiPlaneAddr: '',
                Description: '',
                GwAddr: '',
                GwClusterName: '',
                VirtualGwId: this.VirtualGwId,
                GwName: '',
                GwType: '',
                Type: '',
                HealthInterfacePath: null,
                ProjectIds: [],
                Status: 1,
                VirtualHostList: [],
            },
            headers: TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
            httpheaders: HTTP_TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
            pluginheaders: PLUGIN_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
            domainheaders: {},
            httpList: [],
            pluginList: [],
            visible: false,
        };
    },
    filters: {
        type(val) {
            if (val === 'PathPrefix') return '前缀';
            else if (val === 'Exact') return '精确';
            return '-';
        },
    },
    computed: {
        VirtualGwId() {
            if (this.$route.query) {
                return this.$route.query.VirtualGwId;
            }
            return null;
        },
        apiType() {
            switch (this.info.Type) {
                case 'ApiGateway':
                    return 'API网关';
                case 'LoadBalance':
                    return '负载均衡';
                case 'KubernetesGateway':
                    return 'Kubernetes Gateway';
                case 'KubernetesIngress':
                    return 'Kubernetes Ingress';
                case 'ServerlessGateway':
                    return 'Serverless网关';
                case 'NetworkProxy':
                    return '通用网关';
                default:
                    return '-';
            }
        },
        basicInfoList() {
            const info = this.info || {};
            return [
                { label: '虚拟网关名称', text: info.Name },
                { label: '虚拟网关标识', text: info.Code },
                { label: '类型', text: this.apiType },
                { label: '所属网关', text: info.GwName },
                { label: '监听协议', text: info.Protocol },
                { label: '监听端口', text: info.Port },
                { label: '访问地址', text: info.Addr },
                { label: '备注信息', text: info.Description },
            ];
        },
        routeName() {
            if (this.httpList.length > 0) {
                return this.httpList.map(item => {
                    return item.routeName;
                });
            }
            return '-';
        },
        routeHosts() {
            if (this.httpList.length > 0) {
                return this.httpList.map(item => {
                    return item.routeHosts.map(host => {
                        return host;
                    });
                });
            }
            return '-';
        },
    },
    methods: {
        load(params) {
            return this.axios({
                action: 'DescribeVirtualGatewayById',
                params: {
                    ...params,
                    VirtualGwId: this.VirtualGwId,
                },
            }).then(({ Result = [] }) => {
                this.info = Result;
            });
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeKubernetesGateway',
                params: {
                    ...params,
                    VirtualGatewayId: this.VirtualGwId,
                },
            }).then(({ Result = [] }) => {
                return { list: Result, total: Result.length };
            });
        },
        getHttpFromApi(params) {
            return this.axios({
                action: 'DescribeHTTPRoute',
                params: {
                    ...params,
                    VirtualGatewayId: this.VirtualGwId,
                },
            }).then(({ Result = [] }) => {
                this.httpList = Result;
                return { list: Result, total: Result.length };
            });
        },
        getPluginFromApi(params) {
            return this.axios({
                action: 'DescribePluginManager',
                params: {
                    ...params,
                    VirtualGwId: this.VirtualGwId,
                },
            }).then(({ Result = [] }) => {
                this.pluginList = Result;
                return { list: Result, total: Result.length };
            });
        },
        getDomainFromApi(params) {},
        openYaml(params) {
            this.visible = true;
            return this.axios({
                action: 'DescribeKubernetesGatewayYaml',
                params: {
                    ...params,
                    VirtualGatewayId: this.VirtualGwId,
                },
            }).then(({ Result = [] }) => {
                this.visible = false;
                console.log(Result);
            });
        },
        handleEnabled(item) {
            const { DisplayName, Enable, Name } = item;
            this.$confirm({
                title: '确认提示',
                message: `警告，是否${Enable ? '启用' : '禁用'} ${DisplayName} 插件?,${Enable ? '开启' : '关闭'}`,
                ok: () => {
                    return this.axios({
                        action: 'UpdatePluginManager',
                        data: {
                            VirtualGwId: this.VirtualGwId,
                            Name,
                            Enable,
                        },
                    }).then(() => {
                        this.$notify.success(`${Enable ? '启用' : '禁用'}成功!`);
                        this.getPluginFromApi();
                    });
                },
            });
        },
        editDomain() {},
    },
    created() {
        this.load();
    },
};
</script>
<style lang="scss" module>
.tit {
    display: flex;
    justify-content: space-between;
}
.color {
    color: #00a3a3;
}
</style>
