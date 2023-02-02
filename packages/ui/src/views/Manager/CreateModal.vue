<template>
    <g-modal-form :title="type==='edit'?'修改网关':'创建网关'" visible :submit="handleSubmit" @close="handleClose">
        <validation-provider v-slot="{ errors }" name="网关名称" rules="required">
            <v-text-field v-model="form.Name" label="网关名称*" :error-messages="errors" required></v-text-field>
        </validation-provider>
        <!-- <validation-provider
            v-slot="{ errors }"
            name="网关地址"
            rules="required"
        >
            <v-text-field
                v-model="form.GwAddr"
                label="网关地址*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>-->
        <validation-provider v-slot="{ errors }" name="ApiPlane 地址" rules="required">
            <v-text-field v-model="form.ConfAddr" label="ApiPlane 地址*" :error-messages="errors" required></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="网关集群名称" rules="required">
            <v-text-field v-model="form.GwClusterName" label="网关集群名称*" :error-messages="errors" required></v-text-field>
        </validation-provider>
        <!-- 绑定 host HostList -->
        <!-- <div>
            <g-label>域名列表</g-label>
            <validation-provider
                v-slot="{ errors }"
                name="HostList"
            >
                    <g-multi-validation-text-field
                        label="host"
                        rules="Required"
                        :error-messages="errors"
                        v-model="form.VirtualHostList[0].HostList">
                    </g-multi-validation-text-field>
            </validation-provider>
        </div>-->
        <validation-provider v-slot="{ errors }" name="备注信息">
            <v-textarea v-model="form.Description" label="备注信息" :error-messages="errors"></v-textarea>
        </validation-provider>
    </g-modal-form>
</template>
<script>
const TEMPLATE_MODEL = {
    Name: '',
    EnvId: 'abc',
    svcType: 'ClusterIP',
    // GwAddr: '',
    Description: '',
    ProjectIds: [ 1 ], // 默认 1
    Type: 'envoy',
    ConfAddr: '',
    GwClusterName: '',
    // VirtualHostList: [{ ProjectId: 1, HostList: [''], BindType: 'host' }],
    // HostList: [ '' ],
};
import _ from 'lodash';
import { ValidationProvider } from 'vee-validate';
export default {
    components: {
        ValidationProvider,
    },
    props: {
        current: Object,
        type: {
            type: String,
            default: 'add',
        },
    },
    data: () => ({
        form: JSON.parse(JSON.stringify(TEMPLATE_MODEL)),
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
    },
    methods: {
        handleSubmit() {
            return this.axios({
                action: this.isEdit ? 'UpdateGateway' : 'CreateGateway',
                data: {
                    ...this.form,
                    SvcName: 'gateway-proxy',
                },
            }).then(() => {
                this.$notify.success(this.isEdit ? '更新成功' : '创建成功');
                this.handleClose();
            });
        },
        handleClose() {
            this.$emit('close');
        },
    },
    created() {
        if (this.isEdit) {
            this.form = JSON.parse(JSON.stringify(_.pick(this.current, [ 'GwId', ...Object.keys(TEMPLATE_MODEL) ])));
        }
    },
};
</script>

