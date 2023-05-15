<template>
    <g-modal-form
        :title="isEdit ? '修改路由' : '创建路由'"
        :okText="isEdit ? '保存' : '创建'"
        visible
        :submit="handleSubmit"
        @close="handleClose"
        maxWidth="900px"
    >
        <validation-provider
            v-slot="{ errors }"
            name="路由名称"
            rules="required"
        >
            <v-text-field
                v-model="form.Name"
                label="路由名称*"
                :disabled="isEdit"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
         <validation-provider
            name="路由别名"
        >
            <v-text-field
                v-model="form.Alias"
                label="路由别名"
            ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="目标网关" rules="required">
            <g-gateway-select
                v-model="form.VirtualGwId"
                label="目标网关*"
                :disabled="isEdit"
                :error-messages="errors"
                required
            ></g-gateway-select>
        </validation-provider>
        <validation-provider name="状态">
            <v-radio-group label="状态" row v-model="form.EnableState">
                <v-radio label="启用" value="enable"></v-radio>
                <v-radio label="禁用" value="disable"></v-radio>
            </v-radio-group>
        </validation-provider>
        <validation-provider name="Method">
            <v-autocomplete
                v-model="form.Method"
                :items="SUPPORT_METHOD_KEYS"
                chips
                small-chips
                label="Method"
                multiple
            ></v-autocomplete>
        </validation-provider>

        <g-label>Path</g-label>
        <v-row>
            <v-col
                cols="12"
                sm="6"
            >
                <validation-provider
                    v-slot="{ errors }"
                    name="匹配方式"
                    rules="required"
                >
                    <v-select
                        v-model="form.Uri.Type"
                        :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('Path') : true)"
                        label="匹配方式"
                        :error-messages="errors"
                        required
                    ></v-select>
                </validation-provider>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
                <g-multi-validation-text-field
                    label="条件取值"
                    rules="Required"
                    v-model="form.Uri.Value">
                </g-multi-validation-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col
                v-for="item in SUPOORT_MODAL_TYPES.filter(item => item.key !== 'Uri')"
                :key="item.key"
                cols="3"
            >
            <v-checkbox
                v-model="typeSelected"
                :label="item.text"
                :value="item.key"
                @change="handleTypeSelectChange"
            ></v-checkbox>
            </v-col>
        </v-row>
<!-- Header -->
        <v-row v-if="typeSelected.includes('Headers')">
            <v-col
                cols="12"
            >
                <g-label>Header</g-label>
            </v-col>
            <v-col
                cols="12"
            >
                <g-simple-table :headers="supoortModal" :list="form.Headers">
                    <template #item.Key="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="参数名"
                            rules="required"
                        >
                            <v-text-field
                                v-model="item.Key"
                                label="参数名*"
                                :error-messages="errors"
                                required
                            ></v-text-field>
                        </validation-provider>
                    </template>
                    <template #item.Type="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="匹配方式"
                            rules="required"
                        >
                            <v-select
                                v-model="item.Type"
                                :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('Headers') : true)"
                                label="匹配方式"
                                :error-messages="errors"
                                required
                            ></v-select>
                        </validation-provider>
                    </template>
                    <template #item.Value="{ item }">
                        <g-multi-validation-text-field
                            style="margin-bottom: 10px;"
                            label="条件取值"
                            rules="Required"
                            v-model="item.Value">
                        </g-multi-validation-text-field>
                    </template>
                    <template #item.actions="{ index }">
                        <div>
                            <ActionBtnComp
                                color="error"
                                icon="mdi-delete"
                                tooltip="删除"
                                @click="removeOneItem('Headers', index)"
                            ></ActionBtnComp>
                        </div>
                    </template>
                </g-simple-table>
                <v-btn block @click="() => addOneItem('Headers')">添加一个</v-btn>
            </v-col>
        </v-row>

<!-- Query -->
        <v-row v-if="typeSelected.includes('QueryParams')">
            <v-col
                cols="12"
            >
                <g-label>Query</g-label>
            </v-col>
            <v-col
                cols="12"
            >
                <g-simple-table :headers="supoortModal" :list="form.QueryParams">
                    <template #item.Key="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="参数名"
                            rules="required"
                        >
                            <v-text-field
                                v-model="item.Key"
                                label="参数名*"
                                :error-messages="errors"
                                required
                            ></v-text-field>
                        </validation-provider>
                    </template>
                    <template #item.Type="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="匹配方式"
                            rules="required"
                        >
                            <v-select
                                v-model="item.Type"
                                :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('QueryParams') : true)"
                                label="匹配方式"
                                :error-messages="errors"
                                required
                            ></v-select>
                        </validation-provider>
                    </template>
                    <template #item.Value="{ item }">
                        <g-multi-validation-text-field
                            style="margin-bottom: 10px;"
                            label="条件取值"
                            rules="Required"
                            v-model="item.Value">
                        </g-multi-validation-text-field>
                    </template>
                    <template #item.actions="{ index }">
                        <div>
                            <ActionBtnComp
                                color="error"
                                icon="mdi-delete"
                                tooltip="删除"
                                @click="removeOneItem('QueryParams', index)"
                            ></ActionBtnComp>
                        </div>
                    </template>
                </g-simple-table>
                <v-btn block @click="() => addOneItem('QueryParams')">添加一个</v-btn>
            </v-col>
        </v-row>

        <validation-provider
            v-slot="{ errors }"
            name="优先级"
            rules="required"
        >
            <v-text-field
                v-model.number="form.Priority"
                label="优先级*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <!-- 服务 -->
        <v-card v-if="form.VirtualGwId">
            <v-card-title>目标服务</v-card-title>
            <v-card-subtitle>修改路由时，关联服务只能选择原协议类型的服务。</v-card-subtitle>
            <v-card-text>
                <validation-provider name="服务模式">
                    <v-radio-group label="服务模式" row v-model="serviceType">
                        <v-radio label="单服务" value="single"></v-radio>
                        <v-radio label="多服务" value="multiple"></v-radio>
                    </v-radio-group>
                </validation-provider>
                <!-- 单服务 -->
                <template v-if="serviceType === 'single'">
                    <v-row>
                        <v-col cols="12" md="6">
                            <validation-provider
                                v-slot="{ errors }"
                                name="目标服务"
                                rules="required"
                            >
                                <g-service-select
                                    v-model="singleFrom.ServiceId"
                                    :VirtualGwId="form.VirtualGwId"
                                    label="目标服务*"
                                    :error-messages="errors"
                                    @change="handleChangeService(singleFrom.ServiceId)"
                                    required
                                ></g-service-select>
                            </validation-provider>
                        </v-col>
                         <v-col cols="12" md="6">
                            <validation-provider
                                name="端口"
                            >
                                <v-select
                                    label="端口"
                                    v-model="singleFrom.Port"
                                    :items="serviceProxyInfo.Port"
                                ></v-select>
                            </validation-provider>
                        </v-col>
                    </v-row>
                    <validation-provider name="路由策略">
                        <v-radio-group label="路由策略" row v-model="advancedVersionSwitch">
                            <v-radio label="所有实例" :value="false"></v-radio>
                            <v-radio label="版本实例" :value="true" v-if="serviceProxyInfo.Subsets && serviceProxyInfo.Subsets.length"></v-radio>
                        </v-radio-group>
                    </validation-provider>
                    <g-form-table v-if="advancedVersionSwitch" key="singleFrom" isAdd isDelet :data.sync="singleFrom.DestinationServices" :add="() => ({ServiceId:singleFrom.ServiceId, SubsetName: '', Port: '', Weight: ''})">
                        <template slot-scope="scope">
                            <v-col cols="12" md="3" v-for="(item, index) in DestinationServicesDataModel" :key="item.key">
                                <validation-provider
                                    v-slot="{ errors }"
                                    :name="item.name"
                                    :rules="item.rules"
                                >
                                    <v-select
                                        v-if="item.select"
                                        :label="item.name"
                                        v-model="scope.row[item.key]"
                                        :items="item.select"
                                    ></v-select>
                                    <v-text-field
                                        v-else
                                        v-model="scope.row[item.key]"
                                        :label="item.name"
                                    ></v-text-field>
                                </validation-provider>
                            </v-col>
                        </template>
                    </g-form-table>
                </template>
                <!-- 多服务 -->
                <template v-else>
                    <g-form-table isAdd isDelet key="multipleForm" :data.sync="multipleForm.data" :add="() => ({ServiceId: '', Weight:'', Port: '', serviceProxyInfo:null})">
                        <template slot-scope="scope">
                            <v-col cols="12" md="3">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="目标服务"
                                    rules="required"
                                >
                                    <g-service-select
                                        v-model="scope.row.ServiceId"
                                        :VirtualGwId="form.VirtualGwId"
                                        label="目标服务*"
                                        :error-messages="errors"
                                        required
                                        @change="handleChangeService(scope.row.ServiceId, scope.row)"
                                    ></g-service-select>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" md="3" v-if="scope.row.serviceProxyInfo">
                                <validation-provider
                                    name="端口"
                                >
                                    <v-select
                                        label="端口"
                                        v-model="scope.row.Port"
                                        :items="scope.row.serviceProxyInfo.Port"
                                    ></v-select>
                                </validation-provider>
                            </v-col>
                            <v-col cols="12" md="3">
                                <validation-provider
                                    v-slot="{ errors }"
                                    name="权重"
                                    rules="required"
                                >
                                    <v-text-field
                                        v-model="scope.row.Weight"
                                        :error-messages="errors"
                                        label="权重*"
                                    ></v-text-field>
                                </validation-provider>
                            </v-col>
                        </template>
                    </g-form-table>
                </template>
            </v-card-text>
        </v-card>
        <validation-provider
            v-slot="{ errors }"
            name="超时时间"
            rules="required"
        >
            <v-text-field
                v-model="form.Timeout"
                label="超时时间*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <!-- 重试 -->
        <template>
            <v-switch
                v-model="form.HttpRetry.IsRetry"
                label="重试"
            >
            </v-switch>

            <!-- 重试详情 -->
            <template v-if="form.HttpRetry.IsRetry">
                <!-- 重试条件 -->
                <ss-form-schema ref="ssformSchemaRef" v-model="form.HttpRetry" :schema="HttpRetrySchema"></ss-form-schema>
            </template>
        </template>

    </g-modal-form>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
import ActionBtnComp from '@/components/ActionBtn';
import { SUPPORT_TYPES, SUPOORT_MODAL_TYPES, SUPPORT_METHOD_KEYS } from './types';
export default {
    components: {
        ValidationProvider, ActionBtnComp,
    },
    props: {
        current: Object,
        type: {
            type: String,
            default: 'add',
        },
    },
    data: () => ({
        typeSelected: [],
        form: {
            ServiceId: '',
            VirtualGwId: '',
            Name: '',
            Alias: '',
            Priority: '50',
            Uri: {
                Type: 'exact',
                Value: [ '' ],
            },
            EnableState: 'enable',
            Timeout: '60000',
            DestinationServices: [],
            HttpRetry: {
                IsRetry: false,
                RetryOn: [],
                Attempts: '2',
                PerTryTimeout: '60000',
            },
            Method: [],
            // Host: {
            //     Type: 'exact',
            //     Value: [ '' ],
            // },
            // Method: {
            //     Type: 'exact',
            //     Value: [ '' ],
            // },
            // Headers: [],
            // QueryParams: [],
        },
        advancedVersionSwitch: false,
        DestinationServicesDataModel: [],
        serviceProxyInfo: {},
        singleFrom: {
            ServiceId: '',
            Weight: '100',
            Port: '',
            DestinationServices: [],
        },
        multipleForm: {
            data: [],
        },
        serviceType: 'single',
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
        supoortModal() {
            return [
                { text: '参数名', value: 'Key' },
                { text: '匹配方式', value: 'Type' },
                { text: '条件取值', value: 'Value', type: 'array' },
                { text: '操作', value: 'actions', notKey: true },
            ];
        },
        SUPOORT_MODAL_TYPES() {
            return JSON.parse(JSON.stringify(SUPOORT_MODAL_TYPES)).filter(item => item.key !== 'Uri');
        },
        SUPPORT_METHOD_KEYS() {
            return JSON.parse(JSON.stringify(SUPPORT_METHOD_KEYS));
        },
        SUPPORT_TYPES() {
            return JSON.parse(JSON.stringify(SUPPORT_TYPES));
        },
        HttpRetrySchema() {
            return {
                layouts: [
                    {
                        key: 'RetryOn',
                        type: 'checkbox',
                        alias: '重试条件',
                        options: [
                            '5xx',
                            'refused-stream',
                            'connect-failure',
                            'gateway-error',
                        ],
                        rules: [ 'Required' ],
                        default: [],
                    },
                    {
                        key: 'Attempts',
                        type: 'number',
                        alias: '重试次数',
                        placeholder: '1-10内的整数',
                        rules: [ 'Required' ],
                        default: 2,
                    },
                    {
                        key: 'PerTryTimeout',
                        type: 'number',
                        alias: '重试超时时间',
                        placeholder: '1-1000000内的整数',
                        rules: [ 'Required' ],
                        default: 60000,
                    },
                ],
            };
        },
    },
    methods: {
        addOneItem(type) {
            if (this.form[type]) {
                const SUPOORT_MODAL_TYPES = this.SUPOORT_MODAL_TYPES || [];
                const one = SUPOORT_MODAL_TYPES.find(item => item.key === type);
                one && this.form[type].push(JSON.parse(JSON.stringify(one.model)));
            }
        },
        removeOneItem(type, index) {
            if (this.form[type]) {
                this.form[type].splice(index, 1);
            }
        },
        handleTypeSelectChange(v) {
            const SUPOORT_MODAL_TYPES = this.SUPOORT_MODAL_TYPES || [];
            SUPOORT_MODAL_TYPES.forEach(item => {
                const key = item.key;
                if (v.includes(key)) {
                    if (!this.form[key]) {
                        if (item.type === 'object') {
                            this.$set(this.form, key, JSON.parse(JSON.stringify(item.model)));
                        } else {
                            this.$set(this.form, key, [ JSON.parse(JSON.stringify(item.model)) ]);
                        }
                    }
                } else {
                    this.$delete(this.form, key);
                }
            });
        },
        handleSubmit() {
            const data = JSON.parse(JSON.stringify(this.form));
            // 获取重试内容
            if (data.HttpRetry.IsRetry) {
                const ssformSchemaRef = this.$refs.ssformSchemaRef;
                if (ssformSchemaRef) {
                    const config = ssformSchemaRef.getValue();
                    data.HttpRetry = config;
                    data.HttpRetry.IsRetry = true;
                }
            }
            // 处理后端要求的传参形式
            let ServiceMetaForRoute = [];
            if (this.serviceType === 'single') {
                ServiceMetaForRoute = [ this.singleFrom ];
            } else {
                ServiceMetaForRoute = this.multipleForm.data;
            }
            // 重试条件
            if (data.HttpRetry.IsRetry) {
                data.HttpRetry.RetryOn = data.HttpRetry.RetryOn.join(',');
            } else {
                data.HttpRetry.RetryOn = [];
            }
            data.ServiceMetaForRoute = ServiceMetaForRoute;
            return this.axios({
                action: this.isEdit ? 'UpdateRouteRule' : 'CreateRouteRule',
                data,
            }).then(() => {
                this.$notify.success(this.isEdit ? '更新成功' : '创建成功');
                this.handleClose();
            });
        },
        handleClose() {
            this.$emit('close');
        },
        // 获取Port
        async getServiceProxyInfo(Id) {
            const { Result = {} } = await this.axios({
                action: 'DescribeService',
                params: {
                    Id,
                },
            });
            return Result;
        },
        async handleChangeService(e, item) {
            if (this.serviceType === 'single') {
                this.serviceProxyInfo = await this.getServiceProxyInfo(e);
                this.singleFrom.Port = this.serviceProxyInfo.Port[0] || '';
                if (!this.serviceProxyInfo.Subsets) {
                    this.advancedVersionSwitch = false;
                }
                this.DestinationServicesDataModel = this.getDestinationServicesDataModel();
                this.singleFrom.DestinationServices = [];
            } else {
                item.serviceProxyInfo = await this.getServiceProxyInfo(e);
            }
        },
        // 获取版本实例渲染模板
        getDestinationServicesDataModel() {
            const serviceProxyInfo = this.serviceProxyInfo || {};
            const RegistryCenterType = serviceProxyInfo.RegistryCenterType;
            const Ports = serviceProxyInfo.Port || [];
            const result = [];
            const Subsets = (serviceProxyInfo.Subsets && serviceProxyInfo.Subsets.map(item => item.Name)) || null;
            result.push({
                name: '版本',
                key: 'SubsetName',
                value: '',
                select: Subsets,
                placeholder: '请选择版本',
                rules: 'required',
            });
            if (RegistryCenterType === 'Kubernetes') {
                result.push({
                    name: '端口',
                    key: 'Port',
                    value: Ports[0] || '',
                    select: Ports,
                    placeholder: '请选择端口',
                });
            }
            result.push({
                name: '权重',
                key: 'Weight',
                placeholder: '0~100间的整数',
                rules: 'required',
            });
            return result;
        },
    },
    async created() {
        if (this.isEdit) {
            this.form = JSON.parse(JSON.stringify(this.current));
            const SUPOORT_MODAL_TYPES = this.SUPOORT_MODAL_TYPES || [];
            SUPOORT_MODAL_TYPES.forEach(item => {
                const key = item.key;
                if (this.form[key]) {
                    this.typeSelected.push(key);
                }
            });
            // 处理重试回显
            if (this.current.HttpRetry && this.current.HttpRetry.IsRetry && this.current.HttpRetry.RetryOn) {
                this.form.HttpRetry.RetryOn = this.current.HttpRetry.RetryOn.split(',');
            } else {
                this.form.HttpRetry.RetryOn = [];
            }
            // 处理回显
            if (this.current.ServiceMetaForRoute.length > 1) {
                this.serviceType = 'multiple';
                this.multipleForm.data = this.current.ServiceMetaForRoute;
                // 处理port列表
                this.multipleFrom.data.forEach(async item => {
                    item.serviceProxyInfo = await this.getServiceProxyInfo(item.ServiceId);
                });
            } else {
                this.serviceType = 'single';
                this.singleFrom = this.current.ServiceMetaForRoute[0];
                // 处理port列表
                this.serviceProxyInfo = await this.getServiceProxyInfo(this.singleFrom.ServiceId);
                // 处理版本回显
                if (this.current.ServiceMetaForRoute[0] && this.current.ServiceMetaForRoute[0].DestinationServices && this.current.ServiceMetaForRoute[0].DestinationServices.length) {
                    this.advancedVersionSwitch = true;
                    this.DestinationServicesDataModel = this.getDestinationServicesDataModel();
                } else {
                    this.advancedVersionSwitch = false;
                }
            }
        }
    },
};
</script>

