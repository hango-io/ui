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
                tooltip="导入SSL证书"
                color="primary"
                @click="handleCreate()"
            ></ActionBtnComp>
        </template>
        <template v-slot:item.CertificateType="{ item}">
            {{item.CertificateType | type}}
        </template>
        <template v-slot:item.Signature="{ item}">
            {{item.Signature || '-'}}
        </template>
        <template v-slot:item.actions="{ item }">
            <ActionBtnComp
                color="error"
                icon="mdi-delete"
                tooltip="删除"
                @click="handleDelete(item)"
            ></ActionBtnComp>
        </template>
      </g-table-list>
    </div>
    <upload-certify v-if="uploadVisible" @close="handleClose"></upload-certify>
  </v-container>
</template>

<script>
const TABLE_HEADERS = [
    { text: '证书名称', value: 'CertificateName' },
    { text: '证书类型', value: 'custom', name: 'CertificateType' },
    { text: '绑定域名', value: 'Domain' },
    { text: '公钥指纹', value: 'custom', name: 'Signature' },
    { text: '签发机构', value: 'IssuingAgency' },
    { text: '签发时间', value: 'IssuingTime' },
    { text: '到期时间', value: 'ExpiredTime' },
    { text: '操作', value: 'custom', name: 'actions', width: 180 },
];
import _ from 'lodash';
import ActionBtnComp from '@/components/ActionBtn';
import UploadCertify from './UploadCertify.vue';
export default {
    name: 'certify',
    components: { ActionBtnComp, UploadCertify },
    data() {
        return {
            headers: TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
            search: { Pattern: '' },
            uploadVisible: false,
            certifyList: [],
        };
    },
    filters: {
        type(val) {
            if (val === 'serverCert') {
                return '服务器证书';
            } else if (val === 'caCert') {
                return 'CA证书';
            }
            return '-';
        },
    },
    methods: {
        refresh() {
            this.$refs.tableRef && this.$refs.tableRef.refresh();
        },
        getDataFromApi(params) {
            return this.axios({
                action: 'DescribeCertificateList',
                data: {
                    ...params,
                },
            }).then(({ Result = [] }) => {
                return { list: Result, total: Result.length };
            });
        },
        handleCreate() {
            this.uploadVisible = true;
        },
        handleDelete(item) {
            const { CertificateId } = item;
            this.$confirm({
                title: '删除确认提示',
                message: '警告，是否删除该证书?',
                ok: () => {
                    return this.axios({
                        action: 'DeleteCertificate',
                        params: {
                            CertificateId,
                        },
                    }).then(() => {
                        this.$notify.success('删除成功');
                        this.refresh();
                    });
                },
            });
        },
        handleClose() {
            this.uploadVisible = false;
            this.refresh();
        },
    },

};
</script>

<style module>
.header {
    margin-bottom: 12px;
}
</style>
