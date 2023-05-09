<template>
  <v-container fluid>
    <v-breadcrumbs
      class="pl-3"
      v-if="$route.meta && $route.meta.breadcrumbs"
      large
      :items="$route.meta.breadcrumbs"
    ></v-breadcrumbs>
    <div>
      <g-table-list :headers="headers" :load="getDataFromApi" ref="tableRef">
        <template #header>
          <ActionBtnComp
              icon="mdi-refresh"
              tooltip="刷新"
              @click="refreshTable()"
          ></ActionBtnComp>
          <ActionBtnComp
            icon="mdi-plus"
            tooltip="创建虚拟网关"
            color="primary"
            @click="handleCreate()"
          ></ActionBtnComp>
        </template>
        <template #item.Name="{ item }">
          <g-link
            :to="{
              name: 'hango.virtualManager.info',
              query: { Id: item.RouteRuleId,VirtualGwId:item.VirtualGwId},
            }"
            >{{ item.Name }}</g-link
          >
        </template>
        <template #item.Type="{ item }">
          {{ item.Type | apiType }}
        </template>
        <template #item.DomainInfos="{ item }">
            <v-chip small color="success" style="margin-right:4px" v-for="(host, index) in item.DomainInfos" :key="index">
                {{host.Host}}
            </v-chip>
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
        </template>
      </g-table-list>
    </div>
    <CreateModalComp
      v-if="createVisible"
      :current="current"
      @close="handleClose"
    />
    <CreateModalComp
      v-if="editVisible"
      :current="current"
      type="edit"
      @close="handleClose"
    />
  </v-container>
</template>

<script>
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import CreateModalComp from './CreateModal';
const TABLE_HEADERS = [
    { text: '虚拟网关名称', value: 'custom', name: 'Name' },
    { text: '类型', value: 'custom', name: 'Type' },
    { text: '所属网关', value: 'GwName' },
    { text: '监听协议', value: 'Protocol' },
    { text: '监听端口', value: 'Port' },
    { text: '域名', value: 'custom', name: 'DomainInfos' },
    { text: '访问地址', value: 'Addr' },
    { text: '操作', value: 'custom', name: 'actions', width: 120 },
];
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
            Total: 0,
        };
    },
    filters: {
        apiType(val) {
            switch (val) {
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
    },
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
        refreshTable() {
            return this.axios({
                action: 'RefreshKubernetesGateway',
            }).then(() => this.refresh())
                .catch(e => this.$notify.error(e));
        },
        handleCreate() {
            this.current = null;
            this.createVisible = true;
        },
        handleClose() {
            this.createVisible = false;
            this.editVisible = false;
            this.current = null;
            this.refresh();
        },
        handleEdit(item) {
            this.current = item;
            this.editVisible = true;
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeVirtualGateway',
                data: {
                    ...params,
                    Pattern: '',
                    ProjectIdList: null,
                },
            }).then(({ Result = [], Total = 0 }) => {
                this.Total = Total;
                return { list: Result, total: Total };
            });
        },
        handleDelete(item) {
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该虚拟网关?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteVirtualGateway',
                        params: {
                            ..._.pick(item, [ 'VirtualGwId' ]),
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

<style></style>
