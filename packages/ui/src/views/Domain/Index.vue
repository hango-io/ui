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
        <template #top>
            <ActionBtnComp
                icon="mdi-plus"
                tooltip="新增域名"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template v-slot:item.CertificateName="{ item}">
          <v-tooltip top v-if="item.CertificateId"  color="white">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip
                        small
                        color="primary"
                        v-bind="{ ...attrs }"
                        v-on="{ ...on }"
                        @mouseenter="handleCertifyInfo(item)"
                        >
                      {{ item.CertificateName }}
                    </v-chip>
                </template>
                <certificate-info :loading="loadingCertifyInfo" :info="certificateInfos" />
            </v-tooltip>
        </template>
        <template v-slot:item.actions="{ item }">
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
    <CreateModalComp v-if="createVisible" :current="current" @close="handleClose"/>
    <CreateModalComp v-if="editVisible" :current="current" type="edit" @close="handleClose"/>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '域名', value: 'Host' },
    { text: '协议类型', value: 'Protocol' },
    { text: '证书', value: 'custom', name: 'CertificateName' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import CreateModalComp from './CreateModal';
import CertificateInfo from './CertificateInfo.vue';

export default {
    components: { ActionBtnComp, CreateModalComp, CertificateInfo },
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
            certificateInfos: {},
            loadingCertifyInfo: false,
            current: {},
        };
    },
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeDomainPage',
                data: {
                    ...params,
                },
            }).then(({ Result = [], Total = 0 }) => {
                return { list: Result, total: Total };
            });
        },
        handleCertifyInfo({ CertificateId }) {
            this.loadingCertifyInfo = true;
            return this.axios({
                action: 'DescribeCertificateInfo',
                params: {
                    CertificateId,
                },
            }).then(({ Result = {} }) => {
                Result.ExpiredTime = Result.ExpiredTime.split(' ')[0];
                Result.IssuingTime = Result.IssuingTime.split(' ')[0];
                this.certificateInfos = Result;
            }).finally(() => {
                this.loadingCertifyInfo = false;
            });
        },
        handleClose() {
            this.createVisible = false;
            this.editVisible = false;
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
        handleChangeStatus(item, isEnableFlag) {
            this.$confirm({
                title: isEnableFlag ? '启用确认提示' : '禁用确认提示',
                message: '警告，是否' + (isEnableFlag ? '启用' : '禁用') + '该插件?',
                ok: () => {
                    return this.axios({
                        action: 'UpdatePluginBindingStatus',
                        params: {
                            ..._.pick(item, [
                                'PluginBindingInfoId',
                            ]),
                            BindingStatus: isEnableFlag ? 'enable' : 'disable',
                        },
                    }).then(() => {
                        this.$notify.success('操作成功');
                        this.refresh();
                    });
                },
            });
        },
        handleDelete(item) {
            const { DomainId } = item;
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该域名?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteDomain',
                        params: {
                            DomainId,
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
