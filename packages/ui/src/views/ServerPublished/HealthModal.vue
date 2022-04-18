<template>
<!-- TODO -->
    <g-modal-form
        title="健康检查"
        visible
        :submit="handleSubmit"
        @close="handleClose"
    >
        <v-switch
            v-model="form.ActiveSwitch"
            label="主动检查"
        ></v-switch>

        <template v-if="form.ActiveSwitch">
            <validation-provider
                v-slot="{ errors }"
                name="检查路径"
                rules="required"
            >
                <v-text-field
                    v-model="form.Path"
                    placeholder="请输入检查路径"
                    label="检查路径*"
                    :error-messages="errors"
                    required
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="超时时间"
                :rules="{ required: true, between: [1, 1000000000] }"
            >
                <v-text-field
                    v-model="form.Timeout"
                    placeholder="大于 0 的整数"
                    label="超市时间*"
                    :error-messages="errors"
                    required
                    suffix="ms"
                >
                <template v-slot:append-outer>
                    <g-note>是指网关转发给后端实例的请求在指定的时间内未返回，有可能是网络异常或者实例异常</g-note>
                </template>
            </v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="健康状态码"
                :rules="{ required: true, length: 3, between: [100, 999] }"
            >
                <v-text-field
                    v-model="form.ExpectedStatuses"
                    placeholder="必须为3位有效整数"
                    label="健康状态码*"
                    :error-messages="errors"
                    required
                >
                </v-text-field>
            </validation-provider>

            <g-label>
                <span>健康实例检查</span>
                <g-note>当健康实例连续N次的检查都是异常时，该实例变为异常状态，异常实例总数不超过总数的50%</g-note>
            </g-label>
            <v-row>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <validation-provider
                        v-slot="{ errors }"
                        name="检查间隔"
                        :rules="{ required: true, between: [1, 1000000000] }"
                    >
                        <v-text-field
                            v-model="form.HealthyInterval"
                            placeholder="请输入1-1000000数字"
                            label="检查间隔*"
                            :error-messages="errors"
                            required
                            suffix="ms"
                        ></v-text-field>
                    </validation-provider>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <validation-provider
                        v-slot="{ errors }"
                        name="健康阈值"
                        :rules="{ required: true, between: [1, 1000000000] }"
                    >
                        <v-text-field
                            v-model="form.HealthyThreshold"
                            placeholder="请输入1-1000000数字"
                            label="健康阈值*"
                            :error-messages="errors"
                            required
                            suffix="次"
                        ></v-text-field>
                    </validation-provider>
                </v-col>
            </v-row>

            <g-label>
                <span>异常实例检查</span>
                <g-note>当异常实例连续N次的检查都是健康时，该实例变为健康状态</g-note>
            </g-label>
            <v-row>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <validation-provider
                        v-slot="{ errors }"
                        name="检查间隔"
                        :rules="{ required: true, between: [1, 1000000000] }"
                    >
                        <v-text-field
                            v-model="form.UnhealthyInterval"
                            placeholder="请输入1-1000000数字"
                            label="检查间隔*"
                            :error-messages="errors"
                            required
                            suffix="ms"
                        ></v-text-field>
                    </validation-provider>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <validation-provider
                        v-slot="{ errors }"
                        name="健康阈值"
                        :rules="{ required: true, between: [1, 1000000000] }"
                    >
                        <v-text-field
                            v-model="form.UnhealthyThreshold"
                            placeholder="请输入1-1000000数字"
                            label="健康阈值*"
                            :error-messages="errors"
                            required
                            suffix="次"
                        ></v-text-field>
                    </validation-provider>
                </v-col>
            </v-row>

        </template>

        <v-switch
            v-model="form.PassiveSwitch"
            label="被动检查"
        ></v-switch>

        <template v-if="form.PassiveSwitch">
            <validation-provider
                v-slot="{ errors }"
                name="连续失败次数"
                :rules="{ required: true, between: [1, 1000000000] }"
            >
                <v-text-field
                    v-model="form.ConsecutiveErrors"
                    placeholder="大于 0 的整数"
                    label="连续失败次数*"
                    :error-messages="errors"
                    required
                    suffix="次"
                >
                    <template v-slot:append-outer>
                        <g-note>是指发送给同一个实例的请求连续失败多少次后，网关判断该实例为异常，网关将在指定时间内不转发请求到该实例</g-note>
                    </template>
                </v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="驱逐时间"
                :rules="{ required: true, between: [1, 1000000000] }"
            >
                <v-text-field
                    v-model="form.BaseEjectionTime"
                    placeholder="大于 0 的整数"
                    label="驱逐时间*"
                    :error-messages="errors"
                    required
                    suffix="ms"
                >
                    <template v-slot:append-outer>
                        <g-note>服务实例被驱逐后，API网关不再转发请求给该服务实例， 当驱逐时间过后，该服务实例将被重新设定为正常状态</g-note>
                    </template>
                </v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="最多可驱逐实例比"
                :rules="{ required: true, between: [1, 100] }"
            >
                <v-text-field
                    v-model="form.MaxEjectionPercent"
                    placeholder="大于 0 的整数"
                    label="最多可驱逐实例比*"
                    :error-messages="errors"
                    required
                    suffix="%"
                >
                    <template v-slot:append-outer>
                        <g-note>指定最多可被驱逐的后端实例数量， 实例数量=总数*百分比</g-note>
                    </template>
                </v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="最小健康实例比"
                :rules="{ required: true, between: [1, 100] }"
            >
                <v-text-field
                    v-model="form.MinHealthPercent"
                    placeholder="大于 0 的整数"
                    label="最小健康实例比*"
                    :error-messages="errors"
                    required
                    suffix="%"
                >
                    <template v-slot:append-outer>
                        <g-note>当健康实例数小于最小健康实例比×总实例数时，则关闭健康检查</g-note>
                    </template>
                </v-text-field>
            </validation-provider>

        </template>

    </g-modal-form>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
const TEMPLATE_MODEL = {
    ActiveSwitch: 0,
    Path: '/',
    Timeout: undefined,
    ExpectedStatuses: [],
    HealthyInterval: undefined,
    HealthyThreshold: undefined,
    UnhealthyInterval: undefined,
    UnhealthyThreshold: undefined,
    PassiveSwitch: 0,
    ConsecutiveErrors: 5,
    BaseEjectionTime: 30000,
    MaxEjectionPercent: 10,
    MinHealthPercent: 50,
};
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
        GwId() {
            return this.current && this.current.GwId;
        },
        ServiceId() {
            return this.current && this.current.ServiceId;
        },
    },
    methods: {
        load() {
            let chain = Promise.resolve();

            console.info('this.current:', this.current);
            chain = chain.then(() => this.axios({
                action: 'DescribeHealthCheckRule',
                params: {
                    GwId: this.GwId,
                    ServiceId: this.ServiceId,
                },
            }));

            chain = chain.then(({ HealthCheckRule }) => {
                this.form = HealthCheckRule || this.form;
            });

            return chain;
        },
        reset() {
            this.form = JSON.parse(JSON.stringify(TEMPLATE_MODEL));
        },
        handleSubmit() {
            const form = JSON.parse(JSON.stringify(this.form));
            const param = Object.keys(form).reduce((obj, key) => {
                if (this.form[key] !== undefined && this.form[key] !== '') {
                    obj[key] = this.form[key];
                }
                return obj;
            }, {});
            console.log(param);
            const promise = this.axios({
                action: 'UpdateHealthCheckRule',
                data: {
                    ...Object.assign(param, {
                        GwId: this.GwId,
                        ServiceId: this.ServiceId,
                    }),
                },
            });
            return promise.then(() => {
                this.$notify.success('设置成功');
                this.handleClose();
            });
        },
        handleClose() {
            this.$emit('close');
        },
    },
    created() {
        this.load();
    },
};
</script>

