<template>
    <v-container fluid>
        <v-breadcrumbs class="pl-3" v-if="$route.meta && $route.meta.breadcrumbs" large :items="$route.meta.breadcrumbs"></v-breadcrumbs>
        <div :class="$style.menu">
            <v-timeline :reverse="false" dense>
                <v-timeline-item
                    fill-dot
                    v-for="(item, index) in menuList"
                    :key="index"
                    small
                    :color="item.color">
                    <v-alert
                        @click="linkTo(item)"
                        style="cursor: pointer"
                        :value="true"
                        :color="item.color"
                        class="white--text">
                        {{item.text}}
                    </v-alert>
                </v-timeline-item>
            </v-timeline>
        </div>
        <div style="width:80%">
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
            <v-row id="baseInfo">
                <!-- 基础信息 -->
                <v-col>
                    <g-info-card title="基础信息" :list="basicInfoList"></g-info-card>
                </v-col>
            </v-row>
            <template v-if="info.Type =='KubernetesGateway'">
                <v-row id="Gateway">
                    <!-- gateway -->
                    <v-col>
                        <g-info-card title="Gateway">
                            <template #extra>
                                <div :class="$style.color" @click="openYamlGateway">查看yaml</div>
                            </template>
                            <g-table-list ref="gatewayList" :headers="headers" :load="getDataFromApi" hide-default-footer>
                                <template #header>
                                    <div class="ml-4">{{ "" }}</div>
                                </template>
                                <template #item.pluginBindingDtos="{ item }">
                                    <template>
                                        <v-chip
                                            class="mr-2"
                                            x-small
                                            color="primary"
                                            label
                                            close
                                            @click:close="deletePlugin(value)"
                                            @click="openPlugin(value, false)"
                                            v-for="value in item.pluginBindingDtos"
                                            :key="value.PluginBindingInfoId"
                                        >{{ value.PluginName || "-" }}</v-chip>
                                    </template>
                                    <v-icon color="secondary" @click="openPlugin(item, true)">mdi-plus</v-icon>
                                </template>
                            </g-table-list>
                        </g-info-card>
                    </v-col>
                </v-row>
                <v-row id="httpRoute">
                    <!-- http route -->
                    <v-col>
                        <g-info-card title="HTTP Route">
                            <template #extra>
                                <v-icon color="secondary" @click="getHttpFromApi">mdi-reload</v-icon>
                            </template>
                            <template v-for="(item, index) in httpList">
                                <g-info-card :key="index" :title="`HTTP Route Name:${item.routeName}`">
                                    <template #extra>
                                        <div class="mr-4" :class="$style.color" @click="openYamlHttp(item.yamlStr)">{{ "查看yaml" }}</div>
                                    </template>
                                    <v-simple-table>
                                        <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    rule match
                                                </th>
                                                <th class="text-left">
                                                    backend
                                                </th>
                                                <th class="text-left">
                                                    filter
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="cell in item.rules" :key="cell.index">
                                                <td>
                                                    <div v-for="(tag, index) in cell.matches" :key="index">
                                                        <v-chip  class="mr-2" x-small color="success" label>{{tag.type | type}}</v-chip>
                                                        <v-chip  class="mr-2" x-small color="primary" label>{{tag.value}}</v-chip>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        v-for="(backend, index) in cell.backendRefs"
                                                        :key="index"
                                                    >{{backend.name || '-'}}:{{backend.port || '-'}}</span>
                                                </td>
                                                <td>
                                                    <v-chip  class="mr-2" x-small color="primary" label v-for="(filter, index) in cell.filters" :key="index">{{filter.type}}</v-chip>
                                                </td>
                                            </tr>
                                        </tbody>
                                        </template>
                                    </v-simple-table>
                                    <!-- <g-table-list ref="httpList" :headers="httpheaders" :load="getHttpFromApi" hide-default-footer>
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
                                    </g-table-list> -->
                                </g-info-card>
                            </template>
                        </g-info-card>
                    </v-col>
                </v-row>
            </template>
            <v-row id="pluginManager">
                <!-- 插件配置 -->
                <v-col>
                    <g-info-card title="插件配置">
                        <g-table-list ref="pluginList" :headers="pluginheaders" :load="getPluginFromApi" hide-default-footer>
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
        <g-modal-form :visible="yamlVisible" title="Yaml" :submit="() => yamlVisible=false" @close="yamlVisible=false">
            <codemirror ref="cmLint" v-model="yamlCode" :options="cmOptions"></codemirror>
        </g-modal-form>
        <pluginModal scope="host" :DomainId="DomainId" :VirtualGwId="VirtualGwId" v-if="pluginVisible" @close="handlePluginClose"></pluginModal>
        <BindModalComp scope="routeRule" :DomainId="DomainId" v-if="editPluginVisible" type="edit" :current="current" @close="handlePluginClose"></BindModalComp>
    </v-container>
</template>

<script>
import pluginModal from '../Plugins/CreateModal.vue';
import BindModalComp from '../Plugins/BindModal.vue';
import { codemirror } from 'vue-codemirror'; // 引入组件
import 'codemirror/lib/codemirror.css';
import _ from 'lodash';
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
const MENU_LIST = [
    {
        id: 'baseInfo',
        text: '基础信息',
        icon: 'mdi-card-bulleted',
        color: '#00a3a3',
        type: [ 'ApiGateway', 'LoadBalance', 'KubernetesGateway', 'KubernetesIngress', 'ServerlessGateway', 'NetworkProxy' ],
    },
    { id: 'Gateway', text: 'Gateway', icon: 'mdi-comment-edit', color: '#00a3a3', type: [ 'KubernetesGateway' ] },
    {
        id: 'httpRoute',
        text: 'HTTP Route',
        icon: 'mdi-folder-network',
        color: '#00a3a3',
        type: [ 'KubernetesGateway' ],
    },
    {
        id: 'pluginManager',
        text: '插件配置',
        icon: 'mdi-brightness-5',
        color: '#00a3a3',
        type: [ 'ApiGateway', 'LoadBalance', 'KubernetesGateway', 'KubernetesIngress', 'ServerlessGateway', 'NetworkProxy' ],
    },
];
export default {
    components: { pluginModal, BindModalComp, codemirror },
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
            httpList: [],
            current: {},
            DomainId: '',
            yamlCode: '',
            cmOptions: {
                value: '', // 编辑器的起始值。可以是字符串，也可以是文档对象。
                mode: 'text/x-hive', // 第一个将模式名称映射到它们的构造函数，第二个将MIME类型映射到模式规范。
                theme: 'liquibyte', // 编辑器样式的主题
                indentWithTabs: true, // 在缩进时，是否tabSize 应该用N个制表符替换前N *个空格。默认值为false。
                smartIndent: true, // 是否使用模式提供的上下文相关缩进（或者只是缩进与之前的行相同）。默认为true。
                lineNumbers: true, // 是否在编辑器左侧显示行号。
                matchBrackets: true, // 括号匹配
                autofocus: true, // 可用于使CodeMirror将焦点集中在初始化上
                extraKeys: { 'Ctrl-Space': 'autocomplete' }, // 按键配置
                hintOptions: {
                    tables: {
                        users: [ 'name', 'score', 'birthDate' ],
                        countries: [ 'name', 'population', 'size' ],
                    },
                },
            },
            yamlVisible: false,
            pluginVisible: false,
            editPluginVisible: false,
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
        menuList() {
            // return [];
            return MENU_LIST.filter(item => item.type.includes(this.info.Type));
        },
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
                return { list: Result, total: Result.length };
            });
        },
        openYamlGateway(params) {
            return this.axios({
                action: 'DescribeKubernetesGatewayYaml',
                params: {
                    ...params,
                    VirtualGatewayId: this.VirtualGwId,
                },
            }).then(({ Result = '' }) => {
                this.yamlVisible = true;
                this.yamlCode = Result;
            });
        },
        openYamlHttp(val) {
            this.yamlVisible = false;
            this.yamlCode = val;
            this.yamlVisible = true;
        },
        handleEnabled(item) {
            const { DisplayName, Enable, Name } = item;
            this.$confirm({
                title: '确认提示',
                message: `警告，是否${Enable ? '启用' : '禁用'} ${DisplayName} 插件?,${Enable ? '开启' : '关闭'}`,
                ok: () => {
                    return this.axios({
                        action: 'UpdatePluginManager',
                        params: {
                            VirtualGwId: this.VirtualGwId,
                            Name,
                            Enable,
                        },
                    }).then(() => {
                        this.$notify.success(`${Enable ? '启用' : '禁用'}成功!`);
                        this.$refs.pluginList.refresh();
                    });
                },
            });
        },
        openPlugin(item, flag) {
            if (flag) {
                this.pluginVisible = true;
                this.DomainId = item.DomainId;
            } else {
                this.current = item;
                this.editPluginVisible = true;
            }
        },
        handlePluginClose() {
            this.pluginVisible = false;
            this.editPluginVisible = false;
            this.$refs.gatewayList.refresh();
        },
        linkTo(item) {
            document.getElementById(item.id).scrollIntoView();
        },
        deletePlugin(item) {
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该插件?',
                ok: () => {
                    return this.axios({
                        action: 'UnbindingPlugin',
                        params: {
                            ..._.pick(item, [
                                'PluginBindingInfoId',
                            ]),
                        },
                    }).then(() => {
                        this.$notify.success('删除成功');
                        this.$refs.gatewayList.refresh();
                    });
                },
            });
        },
        httpRefresh() {
            this.$refs.httpList.refresh();
        },
    },
    async created() {
        await this.load();
        await this.getHttpFromApi();
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
    cursor: pointer;
}
.menu {
    position: fixed;
    z-index: 1;
    right: 12px;
    width: 20%;
}
</style>
