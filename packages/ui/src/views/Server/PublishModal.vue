<template>
<!-- TODO -->
    <g-modal-form
        :title="isEdit ? '发布更新' : '发布服务'"
        visible
        :submit="handleSubmit"
        @close="handleClose"
    >
        <validation-provider
            v-slot="{ errors }"
            name="目标网关"
            rules="required"
        >
            <g-gateway-select
                v-model="form.GwId"
                label="目标网关*"
                :error-messages="errors"
                @change="loadRegistryCenterList"
                required
            ></g-gateway-select>
        </validation-provider>

        <template v-if="form.GwId">
            <validation-provider
                v-slot="{ errors }"
                name="发布方式"
                rules="required"
            >
                <v-radio-group
                    label="发布方式*"
                    v-model="form.PublishType"
                    :error-messages="errors"
                    required
                    row
                    @change="loadRegistryCenterList"
                >
                    <v-radio
                        label="从注册中心同步"
                        value="DYNAMIC"
                    ></v-radio>
                    <v-radio
                        label="静态地址"
                        value="STATIC"
                    ></v-radio>
                </v-radio-group>
            </validation-provider>
            <template v-if="form.PublishType === 'DYNAMIC'">
                <validation-provider
                    v-slot="{ errors }"
                    name="注册中心"
                    rules="required"
                >
                    <v-radio-group
                        label="注册中心*"
                        v-model="form.RegistryCenterType"
                        :error-messages="errors"
                        required
                        row
                        @change="loadRegistryCenterList"
                    >
                        <v-radio
                            label="K8S 注册中心"
                            value="Kubernetes"
                        ></v-radio>
                    </v-radio-group>
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="服务地址"
                    rules="required"
                >
                    <v-select
                        :items="registryCenterList"
                        v-model="form.BackendService"
                        label="服务地址*"
                        :error-messages="errors"
                        required
                    ></v-select>
                </validation-provider>
            </template>
            <template v-else-if="form.PublishType === 'STATIC'">
                <g-multi-validation-text-field
                    rules="Required"
                    label="服务地址*"
                    returnType="string"
                    prefix="http://"
                    v-model="form.BackendService">
                </g-multi-validation-text-field>
            </template>

        </template>
    </g-modal-form>
</template>
<script>
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
        registryCenterList: [],
        form: {
            GwId: '',
            RegistryCenterType: 'Kubernetes',
            PublishType: 'DYNAMIC',
            PublishProtocol: 'http',
            BackendService: '',
        },
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
    },
    methods: {
        loadRegistryCenterList() {
            this.registryCenterList = [];
            const GwId = this.form.GwId;
            if (!GwId) return;
            const RegistryCenterType = this.form.RegistryCenterType;
            if (RegistryCenterType !== 'Kubernetes') {
                return;
            }
            return this.axios({
                action: 'DescribeServiceListByGw',
                params: {
                    GwId,
                    RegistryCenterType,
                },
            }).then(({ ServiceList = [] } = {}) => {
                this.registryCenterList = ServiceList.map(value => ({ value, text: value }));
            });
        },
        handleSubmit() {
            const param = JSON.parse(JSON.stringify(this.form));
            param.ServiceId = this.current.ServiceId;
            return this.axios({
                action: 'PublishService',
                data: {
                    ...param,
                },
            }).then(() => {
                this.$notify.success(this.isEdit ? '更新成功' : '发布成功');
                this.handleClose();
            });
        },
        handleClose() {
            this.$emit('close');
        },
    },
    created() {
    },
};
</script>

