<template>
    <v-container fluid>
        <v-breadcrumbs
            class="pl-3"
            v-if="$route.meta && $route.meta.breadcrumbs"
            large
            :items="$route.meta.breadcrumbs"
        >
        </v-breadcrumbs>
        <div :class="$style.menu">
            <v-timeline :reverse="false" dense>
                <v-timeline-item
                    fill-dot
                    v-for="(item, index) in menuList"
                    :key="index"
                    small
                    :color="item.color"
                    :icon="item.icon">
                    <v-alert
                        @click="linkTo(item)"
                        style="cursor: pointer"
                        :value="true"
                        :color="item.color"
                        class="white--text">
                        {{item.text}}
                    </v-alert>
                </v-timeline-item>
            </v-timeline>
        </div>
        <div v-if="info" style="width:80%">
            <v-card
                class="mx-auto mb-4"
            >
                <v-list-item two-line>
                    <v-list-item-avatar
                        tile
                        size="54"
                    >
                        <v-avatar
                            color="secondary"
                            size="54"
                        >
                            <span class="white--text text-h5">{{ info.Name.substring(0, 2).toUpperCase() }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.Name }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row justify="center">
                                <v-col>
                                    <g-label>协议类型：</g-label>
                                    <v-chip
                                        :color="info.Protocol === 'dubbo' ? 'indigo' : 'info'"
                                        label
                                        text-color="white"
                                        x-small
                                    >
                                        {{ info.Protocol && info.Protocol.toUpperCase() || '-' }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-row id="serviceBaseInfo">
                <v-col>
                    <g-info-card
                        title="基础信息"
                        :list="basicInfoList">
                        <template #ServiceType="{ item }">
                            <v-chip
                                :color="item.text === 'dubbo' ? 'indigo' : 'info'"
                                x-small
                                text-color="white"
                                label
                            >
                                {{ item.text && item.text.toUpperCase() || '-' }}
                            </v-chip>
                        </template>
                    </g-info-card>
                </v-col>
            </v-row>
            <v-row id="serviceMoreInfo">
                <v-col>
                    <g-info-card
                        title="更多配置信息"
                        :list="moreInfoList">
                    </g-info-card>
                </v-col>
            </v-row>
            <v-row v-for="(obj,index) in info.Subsets || []" :key="index">
                <v-col id="serviceSubsetsInfo">
                    <g-info-card
                        :title="`版本${index+1}配置信息`"
                        :list="subsetInfoList">
                        <template slot="versionName">
                            {{obj.Name}}
                        </template>
                        <template slot="Labels">
                            {{`Key: ${Object.keys(obj.Labels)[0]}; Value: ${Object.values(obj.Labels)[0]}`}}
                        </template>
                        <template slot="LoadBalancer">
                            {{LB_MAP.find(val => (val.value === obj.TrafficPolicy.LoadBalancer.Simple || val.value === obj.TrafficPolicy.LoadBalancer.Type)).text}}
                        </template>
                        <!-- <template slot="ConsistentHashType" v-if="obj.TrafficPolicy.LoadBalancer.ConsistentHash">
                            {{ConsistentHashType[obj.TrafficPolicy.LoadBalancer.ConsistentHash.Type]}}
                        </template>
                        <template slot="HttpHeaderName" v-if="obj.TrafficPolicy.LoadBalancer.ConsistentHash && obj.TrafficPolicy.LoadBalancer.ConsistentHash.Type === 'HttpHeaderName'">
                            {{obj.TrafficPolicy.LoadBalancer.ConsistentHash.HttpHeaderName}}
                        </template> -->
                        <template slot="MaxConnections">
                            {{obj.TrafficPolicy.ConnectionPool.TCP.MaxConnections}}
                        </template>
                        <template slot="ConnectTimeout">
                            {{obj.TrafficPolicy.ConnectionPool.TCP.ConnectTimeout}}
                        </template>
                        <template slot="IdleTimeout">
                            {{obj.TrafficPolicy.ConnectionPool.HTTP.IdleTimeout}}
                        </template>
                        <template slot="Http2MaxRequests">
                            {{obj.TrafficPolicy.ConnectionPool.HTTP.Http2MaxRequests}}
                        </template>
                        <template slot="Http1MaxPendingRequests">
                            {{obj.TrafficPolicy.ConnectionPool.HTTP.Http1MaxPendingRequests}}
                        </template>
                        <template slot="MaxRequestsPerConnection">
                            {{obj.TrafficPolicy.ConnectionPool.HTTP.MaxRequestsPerConnection}}
                        </template>
                    </g-info-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>
<script>
import handleApplicationName from '@/components/utils/applicationName.js';
const LB_MAP = [
    {
        text: '轮询',
        value: 'ROUND_ROBIN',
    },
    {
        text: '随机',
        value: 'RANDOM',
        bans: [ 'Spring Cloud Gateway' ],
    },
    {
        text: '最小连接',
        value: 'LEAST_CONN',
        bans: [ 'Spring Cloud Gateway' ],
    },
    {
        text: '一致性哈希',
        value: 'ConsistentHash',
        bans: [ 'Spring Cloud Gateway' ],
    },
];
const MENU_LIST = [
    {
        id: 'serviceBaseInfo',
        text: '基础信息',
        icon: 'mdi-card-bulleted-outline',
        color: '#00a3a3',
    },
    {
        id: 'serviceMoreInfo',
        text: '更多配置信息',
        icon: 'mdi-dots-horizontal-circle-outline',
        color: '#00a3a3',
    },
    {
        id: 'serviceSubsetsInfo',
        text: '版本配置信息',
        icon: 'mdi-unfold-more-horizontal',
        color: '#00a3a3',
    },
];
const ConsistentHashType = {
    HttpHeaderName: '请求头',
    UseSourceIp: '源 IP',
};
export default {
    data() {
        return {
            info: null,
            menuList: [],
        };
    },
    computed: {
        basicInfoList() {
            const info = this.info || {};
            let list = [
                { label: '服务别名', text: info.Alias },
                { label: '协议类型', key: 'ServiceType', text: info.Protocol },
            ];
            const RegistryCenterTypeMap = {
                Kubernetes: 'K8S 注册中心',
                Eureka: 'Eureka 注册中心',
                Zookeeper: 'Zookeeper 注册中心',
                Nacos: 'Nacos 注册中心',
                STATIC: '静态地址',
            };
            switch (info.PublishType) {
                case 'DYNAMIC': {
                    list.push({ label: '服务来源', text: RegistryCenterTypeMap[info.RegistryCenterType] || info.RegistryCenterType });
                    list.push({ label: '应用名称', text: handleApplicationName(info.BackendService) });
                    break;
                }
                case 'STATIC': {
                    list.push({ label: '服务来源', text: RegistryCenterTypeMap[info.PublishType] || info.RegistryCenterType });
                    list.push({ label: '服务地址', text: info.BackendService });
                    break;
                }
                default:
                    break;
            }
            list = list.concat([
                { label: '域名', text: info.Hosts },
                { label: '创建时间', key: 'CreateDate', text: info.CreateTime },
                { label: '修改时间', key: 'ModifyDate', text: info.UpdateTime },
            ]);
            return list;
        },
        moreInfoList() {
            const info = this.info || {};
            let list = [
                { label: '负载均衡', text: LB_MAP.find(item => (item.value === info.TrafficPolicy.LoadBalancer.Simple || item.value === info.TrafficPolicy.LoadBalancer.Type)).text || '-' },
            ];
            if (info.TrafficPolicy.LoadBalancer.ConsistentHash) {
                list.push({ label: '类型', text: ConsistentHashType[info.TrafficPolicy.LoadBalancer.ConsistentHash.Type] });
                if (info.TrafficPolicy.LoadBalancer.ConsistentHash.Type === 'HttpHeaderName') {
                    list.push({ label: '请求头名称', text: info.TrafficPolicy.LoadBalancer.ConsistentHash.HttpHeaderName });
                }
            }
            list = list.concat([
                { label: '最大连接数', text: info.TrafficPolicy.ConnectionPool.TCP.MaxConnections },
                { label: '连接超时', text: info.TrafficPolicy.ConnectionPool.TCP.ConnectTimeout },
                { label: '空闲时间', text: info.TrafficPolicy.ConnectionPool.HTTP.IdleTimeout },
                { label: '最大请求数(HTTP/2)', text: info.TrafficPolicy.ConnectionPool.HTTP.Http2MaxRequests },
                { label: '请求排队上限(HTTP/1.1)', text: info.TrafficPolicy.ConnectionPool.HTTP.Http1MaxPendingRequests },
                { label: '单体连接请求上限', text: info.TrafficPolicy.ConnectionPool.HTTP.MaxRequestsPerConnection },
            ]);
            return list;
        },
        subsetInfoList() {
            return [
                { label: '版本名称', key: 'versionName', text: '' },
                { label: '标签', key: 'Labels', text: '' },
                { label: '负载均衡', key: 'LoadBalancer', text: '' },
                // { label: '类型', key: 'ConsistentHashType', text: '-' },
                // { label: '请求头名称', key: 'HttpHeaderName', text: '-' },
                { label: '最大连接数', key: 'MaxConnections', text: '' },
                { label: '连接超时', key: 'ConnectTimeout', text: '' },
                { label: '空闲时间', key: 'IdleTimeout', text: '' },
                { label: '最大请求数(HTTP/2)', key: 'Http2MaxRequests', text: '' },
                { label: '请求排队上限(HTTP/1.1)', key: 'Http1MaxPendingRequests', text: '' },
                { label: '单体连接请求上限', key: 'MaxRequestsPerConnection', text: '' },
            ];
        },
        LB_MAP() {
            return LB_MAP;
        },
        ConsistentHashType() {
            return ConsistentHashType;
        },
    },
    methods: {
        linkTo(item) {
            document.getElementById(item.id).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        },
        handleApplicationName,
        loadInfo() {
            const { Id } = this.$route.query || {};
            if (!Id) {
                return this.$router.replace(this.$route.meta && this.$route.meta.breadcrumbs && this.$route.meta.breadcrumbs[0].to || '/');
            }
            return this.axios({
                action: 'DescribeService',
                params: {
                    Id,
                },
            }).then(({ Result = {} }) => {
                this.info = Result;
                this.menuList = MENU_LIST.filter(item => {
                    if (item.id === 'serviceSubsetsInfo') {
                        return (this.info.Subsets && this.info.Subsets.length);
                    }
                    return true;
                });
            });
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
<style module>
.menu {
    position: fixed;
    z-index: 1;
    right: 12px;
    width: 20%;
}
</style>
