<template>
    <g-modal-form :title="type==='edit'?'修改域名':'添加域名'" visible :submit="handleSubmit" @close="handleClose">
        <validation-provider v-slot="{ errors }" name="域名" rules="required">
            <v-text-field v-model="form.Host" label="域名*" :error-messages="errors" required :disabled="isEdit" ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="协议类型" rules="required">
            <v-select :items="ProtocolTypes" v-model="form.Protocol" label="协议类型*" :error-messages="errors" required :disabled="isEdit" ></v-select>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="证书" rules="required" v-if="form.Protocol === 'HTTPS'">
            <v-select :items="certifyList" v-model="form.CertificateId" label="证书*" :error-messages="errors" required @change="handleCertificateChange"></v-select>
            <v-card v-if="form.CertificateId" style="margin-top:4px;padding: 12px;">
                <certificate-info :loading="loadingCertifyInfo" :info="certificateInfo" />
            </v-card>
        </validation-provider>
    </g-modal-form>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
import CertificateInfo from './CertificateInfo.vue';
import _ from 'lodash';
const TEMPLATE_MODEL = {
    Protocol: 'HTTP',
    Host: '',
    CertificateId: '',
};
export default {
    components: {
        ValidationProvider,
        CertificateInfo,
    },
    props: {
        scope: String,
        DomainId: [ String, Number ],
        VirtualGwId: [ String, Number ],
        type: {
            type: String,
            default: 'add',
        },
        current: Object,
    },
    data: () => ({
        GwId: '',
        RouteId: '',
        GwList: [],
        PluginList: [],
        form: JSON.parse(JSON.stringify(TEMPLATE_MODEL)),
        ProtocolTypes: [ 'HTTP', 'HTTPS' ],
        certifyList: [],
        loadingCertifyInfo: false,
        certificateInfo: {},
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        handleSubmit() {
            return this.axios({
                action: this.isEdit ? 'UpdateDomain' : 'CreateDomain',
                data: {
                    ...this.form,
                },
            }).then(() => {
                this.$notify.success(this.isEdit ? '更新成功' : '创建成功');
                this.handleClose();
            });
        },
        loadCertify() {
            return this.axios({
                action: 'DescribeCertificateList',
                params: {
                    Offset: 0, Limit: 1000,
                },
            }).then(({ Result = [] }) => {
                this.certifyList = Result.map(item => {
                    return {
                        ...item,
                        text: item.CertificateName,
                        value: item.CertificateId,
                    };
                });
            });
        },
        handleCertificateChange() {
            if (!this.form.CertificateId) return;
            this.loadingCertifyInfo = true;
            return this.axios({
                action: 'DescribeCertificateInfo',
                params: {
                    CertificateId: this.form.CertificateId,
                },
            }).then(({ Result = {} }) => {
                Result.ExpiredTime = Result.ExpiredTime.split(' ')[0];
                Result.IssuingTime = Result.IssuingTime.split(' ')[0];
                this.certificateInfo = Result;
            }).finally(() => {
                this.loadingCertifyInfo = false;
            });
        },
    },
    created() {
        this.loadCertify();
        if (this.isEdit) {
            this.form = _.pick(this.current, Object.keys(TEMPLATE_MODEL));
            this.form.DomainId = this.current.DomainId;
            if (this.form.CertificateId) {
                this.handleCertificateChange();
            }
        }
    },
};
</script>

<style module>
.cardItem {
    height: 100%;
    padding: 5px;
}
</style>
