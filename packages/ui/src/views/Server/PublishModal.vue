<template>
    <!-- TODO -->
    <g-modal-form :title="isEdit ? '发布更新' : '发布服务'" visible :submit="handleSubmit" @close="handleClose">
        <validation-provider v-slot="{ errors }" name="目标网关" rules="required">
            <g-gateway-select v-model="form.GwId" label="目标网关*" :error-messages="errors" @change="loadServiceAddressList" required></g-gateway-select>
        </validation-provider>

        <template v-if="form.GwId">
            <validation-provider v-slot="{ errors }" name="发布方式" rules="required">
                <v-radio-group
                    label="发布方式*"
                    v-model="form.PublishType"
                    :error-messages="errors"
                    required
                    row
                    @change="loadServiceAddressList"
                >
                    <v-radio v-for="item in supportTypes" :key="item.value" :label="item.text" :value="item.value"></v-radio>
                </v-radio-group>
            </validation-provider>
            <template v-if="form.PublishType === 'DYNAMIC'">
                <validation-provider v-slot="{ errors }" name="注册中心" rules="required">
                    <v-radio-group
                        label="注册中心*"
                        v-model="form.RegistryCenterType"
                        :error-messages="errors"
                        required
                        row
                        @change="loadServiceAddressList"
                    >
                        <v-radio v-for="item in registryCenterTypeList" :key="item" :label="item" :value="item"></v-radio>
                    </v-radio-group>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="服务地址" rules="required">
                    <v-select :items="registryCenterList" v-model="form.BackendService" label="服务地址*" :error-messages="errors" required></v-select>
                </validation-provider>
            </template>
            <template v-else-if="form.PublishType === 'STATIC'">
                <g-multi-validation-text-field
                    rules="Required"
                    label="服务地址*"
                    returnType="string"
                    prefix="http://"
                    v-model="form.BackendService"
                ></g-multi-validation-text-field>
            </template>

            <!-- 更多配置 -->
            <v-switch v-model="moreSwitch" label="更多配置"></v-switch>
            <MoreConfig v-model="form.TrafficPolicy" v-show="moreSwitch" :publishType="form.PublishType">
                <g-label slot="title">更多配置</g-label>
            </MoreConfig>

            <VersionExpansionPanels
                v-if="!isDubboType"
                v-model="form.Subsets"
                :staticAddrList="form.BackendService.split(',')"
                :publishType="form.PublishType"
            >
                <g-label slot="title">版本配置</g-label>
            </VersionExpansionPanels>
        </template>
    </g-modal-form>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
import MoreConfig from './MoreConfig';
import VersionExpansionPanels from './VersionExpansionPanels';
export const SUPPORT_TYPES = [
    {
        text: '从注册中心同步',
        value: 'DYNAMIC',
    },
    {
        text: '静态地址',
        value: 'STATIC',
    },
];

export const REGISTRY_CENTER_TYPES = [
    {
        text: 'K8S 注册中心',
        value: 'Kubernetes',
    },
    {
        text: 'Zookeeper 注册中心',
        value: 'Zookeeper',
    },
];
export default {
    components: {
        ValidationProvider,
        VersionExpansionPanels,
        MoreConfig,
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
        GetRegistryCenterList: [],
        registryCenterTypeList: [],
        moreSwitch: false,
        form: {
            GwId: '',
            RegistryCenterType: '',
            PublishType: 'DYNAMIC', // 'STATIC'
            // PublishProtocol: 'http',
            BackendService: '',
        },
    }),
    watch: {
        current: {
            handler() {
                // this.form.PublishProtocol = newValue.ServiceType;
                this.isDubboType ? (this.form.RegistryCenterType = 'Zookeeper') : '';
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
        isDubboType() {
            return this.current.ServiceType === 'dubbo';
        },
        supportTypes() {
            return SUPPORT_TYPES.filter(item => {
                // dubbo 只支持注册中心
                if (this.isDubboType) {
                    return item.value === 'DYNAMIC';
                }
                return true;
            });
        },
        registryCenterTypes() {
            return REGISTRY_CENTER_TYPES.filter(item => {
                // dubbo 只支持 Zookeeper 注册中心
                if (this.isDubboType) {
                    return item.value === 'Zookeeper';
                }
                return item.value !== 'Zookeeper';
            });
        },
    },
    methods: {
        loadServiceAddressList() {
            this.registryCenterList = [];
            const GwId = this.form.GwId;
            if (!GwId) return;
            const RegistryCenterType = this.form.RegistryCenterType;
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
        // 注册中心类型
        loadRegistryCenterType() {
            return this.axios({
                action: 'DescribeRegistryTypes',
                params: {
                    ServiceType: this.current.ServiceType,
                },
            }).then(({ RegistryTypes = [] }) => {
                this.registryCenterTypeList = RegistryTypes;
            });
        },
        handleClose() {
            this.$emit('close');
        },
    },
    created() {
        this.loadRegistryCenterType();
    },
};
</script>

