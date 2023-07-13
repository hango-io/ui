<template>
 <g-modal-form title="导入SSL证书" visible :submit="handleSubmit" @close="handleClose">
    <validation-provider v-slot="{ errors }" name="证书名称" rules="required">
        <v-text-field v-model="form.CertificateName" label="证书名称*" :error-messages="errors" required  ></v-text-field>
    </validation-provider>
    <validation-provider v-slot="{ errors }" name="证书类型" >
        <v-radio-group label="证书类型" v-model="form.CertificateType" row :error-messages="errors" @change="handleCertificateType">
            <v-radio  label="服务器证书" value="serverCert"></v-radio>
        </v-radio-group>
    </validation-provider>
    <validation-provider v-slot="{ errors }" name="请上传证书文件或粘贴证书内容" prop="Content" style="margin:0" rules="required">
        <v-textarea v-model="form.Content" label="证书*" rows="2" :error-messages="errors" required  ></v-textarea>
        <a style="display: block;text-align: end" @click="uploadCertify">上传证书文件</a>
        <input type="file" id="fileCertify" />
    </validation-provider>
    <template v-if="form.CertificateType === 'serverCert'">
        <validation-provider v-slot="{ errors }" name="请上传私钥文件或粘贴私钥内容内容" prop="PrivateKey" style="margin:0" rules="required">
            <v-textarea v-model="form.PrivateKey" label="私钥*" rows="2" :error-messages="errors" required  ></v-textarea>
            <a style="display: block;text-align: end" @click="uploadPrivateKey">上传私钥文件</a>
            <input type="file" id="filePrivateKey" />
        </validation-provider>
    </template>
 </g-modal-form>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
const TEMPLATE_MODEL = {
    CertificateName: '',
    CertificateType: 'serverCert',
    Content: '',
    PrivateKey: '',
};
export default {
    name: 'upload-certify',
    props: {},
    components: {
        ValidationProvider,
    },
    data() {
        return {
            form: JSON.parse(JSON.stringify(TEMPLATE_MODEL)),
            fileList: [],
        };
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        handleSubmit() {
            const param = this.form;
            if (!this.form.PrivateKey) {
                delete param.PrivateKey;
            }
            return this.axios({
                action: 'CreateCertificate',
                data: {
                    ...this.form,
                },
            }).then(() => {
                this.$notify.success('导入成功');
                this.handleClose();
            });
        },
        uploadCertify() {
            const dom = document.getElementById('fileCertify');
            dom.value = '';
            this.form.Content = '';
            dom.click();
            dom.onchange = () => {
                const file = dom.files[0];
                if (file.type !== 'application/x-x509-ca-cert') {
                    this.$notify.error('请上传.crt文件格式');
                    return;
                }
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = f => {
                    this.form.Content = f.target.result;
                };
            };
        },
        uploadPrivateKey() {
            const dom = document.getElementById('filePrivateKey');
            dom.value = '';
            this.form.PrivateKey = '';
            dom.click();
            dom.onchange = () => {
                const file = dom.files[0];
                const suffix = file.name.split('.').pop();
                if (suffix !== 'key') {
                    this.$notify.error('请上传.key文件格式');
                    return;
                }
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = f => {
                    this.form.PrivateKey = f.target.result;
                };
            };
        },
        handleCertificateType() {
            this.form.PrivateKey = '';
        },
    },
};
</script>

<style>
#fileCertify,
#filePrivateKey {
    display: none;
}
</style>
