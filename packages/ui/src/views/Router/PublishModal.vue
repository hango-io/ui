<template>
<!-- TODO -->
    <g-modal-form
        :title="isEdit ? '发布更新' : '发布路由'"
        visible
        :submit="handleSubmit"
        @close="handleClose"
    >
        <validation-provider
            v-slot="{ errors }"
            name="目标网关"
            rules="required"
        >
            <g-gateway-published-select
                :ruleId="current.RouteRuleId"
                v-model="form.GwId"
                label="目标网关*"
                :error-messages="errors"
                required
                @change="handleGatewaySelect"
            ></g-gateway-published-select>
        </validation-provider>

        <template v-if="serviceProxyInfo">
            <v-row>
                <v-col
                    cols="12"
                >
                    <g-label>所属服务</g-label>
                    <div>{{ serviceProxyInfo.ServiceName }}</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="12"
                >
                    <g-label>发布类型</g-label>
                    <div>{{ serviceProxyInfo.PublishType | publishType }}</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="12"
                >
                    <g-label>应用名称</g-label>
                    <div>{{ serviceProxyInfo.BackendService }}</div>
                </v-col>
            </v-row>
            <validation-provider
                v-if="serviceProxyInfo.Port"
                v-slot="{ errors }"
                name="端口"
                rules="required"
            >
                <v-select
                    v-model="form.DestinationServices[0].Port"
                    :items="serviceProxyInfo.Port"
                    label="端口*"
                    :error-messages="errors"
                    required
                ></v-select>
            </validation-provider>

            <!-- 是否使能 -->
            <!-- <validation-provider
                v-slot="{ errors }"
                name="是否使能"
                rules="required"
            >
                <v-radio-group
                    v-model="form.EnableState"
                    row
                    label="是否使能*"
                    :error-messages="errors"
                    required
                    >
                    <v-radio
                        label="使能"
                        value="enable"
                    ></v-radio>
                    <v-radio
                        label="不使能"
                        value="disable"
                    ></v-radio>
                </v-radio-group>
            </validation-provider> -->

            <!-- 超时时间 -->
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
        serviceProxyInfo: null,
        form: {
            GwId: '',
            EnableState: 'enable',
            Timeout: '60000',
            DestinationServices: [],
            HttpRetry: {
                IsRetry: false,
                RetryOn: [],
                Attempts: '2',
                PerTryTimeout: '60000',
            },
        },
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
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
        handleSubmit() {
            const param = JSON.parse(JSON.stringify(this.form));
            param.ServiceId = this.current.ServiceId;
            param.RouteRuleId = this.current.RouteRuleId;
            param.GwIds = [ this.form.GwId ];
            param.Uri = this.current.Uri;
            if (param.HttpRetry.IsRetry) {
                const ssformSchemaRef = this.$refs.ssformSchemaRef;
                if (ssformSchemaRef) {
                    const config = ssformSchemaRef.getValue();
                    console.info('config:', config);
                    param.HttpRetry = config;
                    param.HttpRetry.IsRetry = true;
                }
            }

            return this.axios({
                action: 'PublishRouteRule',
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
        handleGatewaySelect() {
            const VirtualGwId = this.form.GwId;
            const ServiceId = this.current.ServiceId;
            this.serviceProxyInfo = null;
            if (!VirtualGwId) return;
            return this.axios({
                action: 'DescribeServiceProxy',
                params: {
                    VirtualGwId,
                    ServiceId,
                },
            }).then(({ Result = {} } = {}) => {
                this.serviceProxyInfo = Result;
                this.form.DestinationServices = [
                    {
                        BackendService: Result.BackendService,
                        Port: Result.Port ? Result.Port[0] : undefined,
                        Weight: 100,
                        ServiceId,
                    },
                ];
            });
        },
    },
    mounted() {
        // if (this.isEdit) {
        //     this.form = JSON.parse(JSON.stringify(this.current));
        // }
    },
};
</script>

