<template>
    <div>
        <div v-if="$slots.title">
            <slot name="title"></slot>
        </div>

        <validation-provider
            v-slot="{ errors }"
            name="负载均衡"
            rules="required"
        >
            <v-select
                v-model="form.LoadBalancer.Simple"
                :items="LB_MAP"
                label="负载均衡*"
                :error-messages="errors"
                required
            ></v-select>
        </validation-provider>

        <template v-if="form.LoadBalancer.Simple === 'ConsistentHash'">
            <validation-provider
                v-slot="{ errors }"
                name="类型"
                rules="required"
            >
                <v-radio-group
                    v-model="form.LoadBalancer.ConsistentHash.Type"
                    row
                    label="类型*"
                    :error-messages="errors"
                    required
                    >
                    <v-radio
                        label="请求头"
                        value="HttpHeaderName"
                    ></v-radio>
                    <v-radio
                        label="源 IP"
                        value="UseSourceIp"
                    ></v-radio>
                </v-radio-group>
            </validation-provider>

            <validation-provider
                v-slot="{ errors }"
                name="请求头名称"
                rules="required"
            >
                <v-text-field
                    v-model="form.LoadBalancer.ConsistentHash.HttpHeaderName"
                    :disabled="form.LoadBalancer.ConsistentHash.Type === 'UseSourceIp'"
                    placeholder="请输入请求头"
                    label="取值"
                    :error-messages="errors"
                    required
                ></v-text-field>
            </validation-provider>
        </template>

        <g-label>连接池（TCP）</g-label>
        <div style="padding-left: 20px">
            <validation-provider
                v-slot="{ errors }"
                name="最大连接数"
                rules="required"
            >
                <v-text-field
                    v-model="form.ConnectionPool.TCP.MaxConnections"
                    label="最大连接数*"
                    :error-messages="errors"
                    required
                    suffix="个"
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="连接超时"
                rules="required"
            >
                <v-text-field
                    v-model="form.ConnectionPool.TCP.ConnectTimeout"
                    label="连接超时*"
                    :error-messages="errors"
                    required
                    suffix="ms"
                ></v-text-field>
            </validation-provider>
        </div>

        <g-label>连接池（HTTP）</g-label>
        <div style="padding-left: 20px">
            <validation-provider
                v-slot="{ errors }"
                name="空闲时间"
                rules="required"
            >
                <v-text-field
                    v-model="form.ConnectionPool.HTTP.IdleTimeout"
                    label="空闲时间*"
                    :error-messages="errors"
                    placeholder="请输入空闲超时"
                    required
                    suffix="ms"
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="最大请求数（HTTP/2）"
                rules="required"
            >
                <v-text-field
                    v-model="form.ConnectionPool.HTTP.Http2MaxRequests"
                    label="最大请求数（HTTP/2）*"
                    :error-messages="errors"
                    placeholder="请输入最大请求数"
                    required
                    suffix="个"
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="请求排队上限（HTTP/1.1）"
                rules="required"
            >
                <v-text-field
                    v-model="form.ConnectionPool.HTTP.Http1MaxPendingRequests"
                    label="请求排队上限（HTTP/1.1）*"
                    :error-messages="errors"
                    placeholder="请输入请求排队上限"
                    required
                    suffix="个"
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="单连接请求上限"
                rules="required"
            >
                <v-text-field
                    v-model="form.ConnectionPool.HTTP.MaxRequestsPerConnection"
                    label="单连接请求上限*"
                    :error-messages="errors"
                    placeholder="请输入单连接请求上限"
                    required
                    suffix="个"
                ></v-text-field>
            </validation-provider>
        </div>
    </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import _ from 'lodash';
const LB_MAP = [
    {
        text: '轮询',
        value: 'ROUND_ROBIN',
    },
    {
        text: '随机',
        value: 'RANDOM',
    },
    {
        text: '最小连接',
        value: 'LEAST_CONN',
    },
    {
        text: '一致性哈希',
        value: 'ConsistentHash',
    },
];
const TEMPLATE_MODAL = {
    LoadBalancer: {
        Type: 'Simple',
        Simple: 'ROUND_ROBIN',
        ConsistentHash: {
            Type: 'HttpHeaderName',
            HttpCookie: {
                Name: '',
                TTL: '',
            },
            HttpHeaderName: '',
            UseSourceIp: true,
        },
    },
    ConnectionPool: {
        HTTP: {
            Http1MaxPendingRequests: '1024',
            Http2MaxRequests: '1024',
            MaxRequestsPerConnection: '0',
            IdleTimeout: '3000',
        },
        TCP: {
            MaxConnections: '1024',
            ConnectTimeout: '60000',
        },
    },
};
export default {
    components: {
        ValidationProvider,
    },
    model: {
        props: 'value',
        event: 'update',
    },
    props: {
        value: {
            type: Object,
            default: () => JSON.parse(JSON.stringify(TEMPLATE_MODAL)),
        },
        publishType: { // 发布类型
            type: String,
            required: true,
        },
    },
    data() {
        return {
            form: this.value,
        };
    },
    computed: {
        LB_MAP() {
            return JSON.parse(JSON.stringify(LB_MAP));
        },
        isDYNAMIC() {
            return this.publishType === 'DYNAMIC';
        },
    },
    watch: {
        value: {
            handler(nV, oV) {
                if (nV) {
                    if (JSON.stringify(nV) !== JSON.stringify(oV)) {
                        this.form = this.toDisplay(nV);
                    }
                }
            },
            immediate: true,
        },
        form: {
            handler(nV) {
                const data = this.getData();
                this.$emit('update', data);
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        toDisplay(nV) {
            const temp = JSON.parse(JSON.stringify(TEMPLATE_MODAL));
            const data = _.merge(temp, JSON.parse(JSON.stringify(nV)));
            if (data.LoadBalancer.Type === 'ConsistentHash') {
                data.LoadBalancer.Simple = 'ConsistentHash';
            } else if (!data.LoadBalancer.ConsistentHash) {
                data.LoadBalancer.ConsistentHash = JSON.parse(JSON.stringify(TEMPLATE_MODAL.LoadBalancer.ConsistentHash));
            }
            return data;
        },
        getData() {
            const data = JSON.parse(JSON.stringify(this.form));
            if (data.LoadBalancer.Simple === 'ConsistentHash') {
                data.LoadBalancer.Type = 'ConsistentHash';
                data.LoadBalancer.Simple = '';
            } else {
                data.LoadBalancer.Type = 'Simple';
            }
            // 给后端特殊处理
            if (data.LoadBalancer && data.LoadBalancer.ConsistentHash && typeof data.LoadBalancer.ConsistentHash.HttpHeaderName === 'string') {
                data.LoadBalancer.ConsistentHash.HttpHeaderName = data.LoadBalancer.ConsistentHash.HttpHeaderName.trim();
            }
            return data;
        },
    },
};
</script>

<style lang="scss" module>
.root {
    padding: 10px 0;
}
</style>
