<template>
    <!-- TODO -->
    <g-modal-form :title="isEdit ? '修改服务' : '创建服务'" visible :submit="handleSubmit" @close="handleClose">
        <validation-provider v-slot="{ errors }" name="协议类型" rules="required">
            <v-radio-group label="服务类型" v-model="form.Protocol" row :error-messages="errors">
                <v-radio v-for="item in ProtocolType" :key="item.value" :disabled="isEdit" :label="item.text" :value="item.value"></v-radio>
            </v-radio-group>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="服务名称" rules="required">
            <v-text-field v-model="form.Name" label="服务名称*" :disabled="isEdit" :error-messages="errors" required></v-text-field>
        </validation-provider>
        <validation-provider name="服务别名">
            <v-text-field v-model="form.Alias" :disabled="isEdit" label="服务别名"></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="目标网关" rules="required">
            <g-gateway-select
                v-model="form.VirtualGwId"
                label="目标网关*"
                :disabled="isEdit"
                :error-messages="errors"
                @change="handleChange"
                required
            ></g-gateway-select>
        </validation-provider>

        <template v-if="form.VirtualGwId">
            <validation-provider v-slot="{ errors }" name="发布方式" rules="required">
                <v-radio-group
                    label="发布方式*"
                    v-model="form.PublishType"
                    :disabled="isEdit"
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
                        :disabled="isEdit"
                        required
                        row
                        @change="loadServiceAddressList"
                    >
                        <v-radio v-for="item in registryCenterTypeList" :key="item" :label="item" :value="item"></v-radio>
                    </v-radio-group>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="服务地址" rules="required">
                    <v-select
                        :items="registryCenterList"
                        :disabled="isEdit"
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
                    v-model="form.BackendService"
                ></g-multi-validation-text-field>
            </template>
            <validation-provider v-slot="{ errors }" name="域名" rules="required">
                <v-select :items="HostsList" item-text="Host" item-value="Host" v-model="form.Hosts" label="域名*" :error-messages="errors" required></v-select>
            </validation-provider>

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
import handleApplicationName from '@/components/utils/applicationName.js';
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
        HostsList: [],
        moreSwitch: false,
        form: {
            Name: '',
            Protocol: 'http',
            Alias: '',
            VirtualGwId: '',
            RegistryCenterType: '',
            PublishType: 'DYNAMIC', // 'STATIC'
            BackendService: '',
            Hosts: [],
        },
        ProtocolType: [
            {
                text: 'HTTP',
                value: 'http',
            },
            {
                text: 'Dubbo',
                value: 'dubbo',
            },
        ],
    }),
    watch: {
        current: {
            async handler(nV) {
                this.isDubboType ? (this.form.RegistryCenterType = 'Zookeeper') : '';
                if (this.type === 'edit' && nV.VirtualGwId) {
                    await this.loadInfo();
                    await this.loadRegistryCenterType();
                    await this.loadDomain();
                }
                return nV;
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
            return this.form.Protocol === 'dubbo';
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
        handleApplicationName,
        loadServiceAddressList() {
            this.registryCenterList = [];
            const VirtualGwId = this.form.VirtualGwId;
            if (!VirtualGwId) return;
            const RegistryCenterType = this.form.RegistryCenterType;
            return this.axios({
                action: 'DescribeServiceListByGw',
                params: {
                    VirtualGwId,
                    RegistryCenterType,
                },
            }).then(({ Result = [] } = {}) => {
                this.registryCenterList = Result.map(value => ({ value, text: handleApplicationName(value) }));
            });
        },
        handleSubmit() {
            const param = JSON.parse(JSON.stringify(this.form));
            // param.ServiceId = this.current.ServiceId;
            return this.axios({
                action: 'CreateService',
                data: {
                    ...param,
                },
            }).then(() => {
                this.$notify.success(this.isEdit ? '修改成功' : ' 创建成功');
                this.handleClose();
            });
        },
        // 注册中心类型
        loadRegistryCenterType() {
            return this.axios({
                action: 'DescribeRegistryTypes',
                params: {
                    ServiceType: this.form.Protocol,
                    VirtualGwId: this.form.VirtualGwId,
                },
            }).then(({ RegistryTypes = [] }) => {
                this.registryCenterTypeList = RegistryTypes;
            });
        },
        loadDomain() {
            return this.axios({
                action: 'DescribeDomainList',
                data: {
                    VirtualGwId: this.form.VirtualGwId,
                },
            }).then(({ Result = [] }) => {
                this.HostsList = Result;
            });
        },
        loadInfo() {
            return this.axios({
                action: 'DescribeService',
                params: {
                    Id: this.current.Id,
                },
            }).then(({ Result = {} }) => {
                this.form = Result;
            });
        },
        handleChange() {
            this.loadServiceAddressList();
            this.loadRegistryCenterType();
            // this.loadDomain();
        },
        handleClose() {
            this.$emit('close');
        },
    },
};
</script>

