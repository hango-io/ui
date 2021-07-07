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
        },
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
    },
    methods: {
        handleSubmit() {
            const param = JSON.parse(JSON.stringify(this.form));
            param.ServiceId = this.current.ServiceId;
            param.RouteRuleId = this.current.RouteRuleId;
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
            const GwIds = this.form.GwId;
            const ServiceId = this.current.ServiceId;
            this.serviceProxyInfo = null;
            if (!GwIds) return;
            return this.axios({
                action: 'DescribeServiceProxyForPublishRoute',
                params: {
                    GwIds,
                    ServiceId,
                },
            }).then(({ EnvoyServiceProxy = {} } = {}) => {
                this.serviceProxyInfo = EnvoyServiceProxy;
                this.form.DestinationServices = [
                    {
                        BackendService: EnvoyServiceProxy.BackendService,
                        Port: EnvoyServiceProxy.Port ? EnvoyServiceProxy.Port[0] : undefined,
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

