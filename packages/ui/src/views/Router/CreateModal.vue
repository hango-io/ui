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

        <v-row v-if="typeSelected.includes('Method')">
            <v-col cols="12">
                <g-label>Method</g-label>
            </v-col>
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
                        v-model="form.Method.Type"
                        :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('Method') : true)"
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
                <v-autocomplete
                    v-model="form.Method.Value"
                    :items="SUPPORT_METHOD_KEYS"
                    chips
                    small-chips
                    label="条件取值"
                    multiple
                ></v-autocomplete>
                <!-- <g-multi-validation-text-field
                    label="条件取值"
                    v-model="form.Method.Value">
                </g-multi-validation-text-field> -->
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
                    <validation-provider
                        v-slot="{ errors }"
                        name="目标服务"
                        rules="required"
                    >
                        <g-service-select
                            v-model="form.ServiceId"
                            :VirtualGwId="form.VirtualGwId"
                            label="目标服务*"
                            :error-messages="errors"
                            required
                        ></g-service-select>
                    </validation-provider>
                </template>
                <!-- 多服务 -->
                <template v-else>
                    <g-form-table isAdd v-model="multipleForm.data" :add="() => [{ServiceId: '', Weight:'', Port: ''}]">
                        <v-col cols="12" md="4">
                            <validation-provider
                                v-slot="{ errors }"
                                name="目标服务"
                                rules="required"
                            >
                                <g-service-select
                                    v-model="multipleForm.data.ServiceId"
                                    :VirtualGwId="form.VirtualGwId"
                                    label="目标服务*"
                                    :error-messages="errors"
                                    required
                                ></g-service-select>
                            </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                            <validation-provider
                                v-slot="{ errors }"
                                name="端口"
                                rules="required"
                            >
                                <v-select
                                    label="端口*"
                                    :error-messages="errors"
                                    v-model="multipleForm.data.Port"
                                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                                ></v-select>
                            </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                            <validation-provider
                                v-slot="{ errors }"
                                name="权重"
                                rules="required"
                            >
                                <v-text-field
                                    v-model="multipleForm.data.Weight"
                                    label="权重*"
                                ></v-text-field>
                            </validation-provider>
                        </v-col>
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
            return this.axios({
                action: this.isEdit ? 'UpdateRouteRule' : 'CreateRouteRule',
                data: {
                    ...this.form,
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
            this.form = JSON.parse(JSON.stringify(this.current));
            const SUPOORT_MODAL_TYPES = this.SUPOORT_MODAL_TYPES || [];
            SUPOORT_MODAL_TYPES.forEach(item => {
                const key = item.key;
                if (this.form[key]) {
                    this.typeSelected.push(key);
                }
            });
        }
    },
};
</script>

