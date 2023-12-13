<template>
    <v-container fluid>
        <v-breadcrumbs class="pl-3" v-if="$route.meta && $route.meta.breadcrumbs" large :items="$route.meta.breadcrumbs">
        </v-breadcrumbs>
        <div v-if="info">
            <v-card class="mx-auto mb-4">
                <v-list-item two-line>
                    <v-list-item-avatar tile size="54">
                        <v-avatar color="secondary" size="54">
                            <span class="white--text text-h5">{{
                                info.Name.substring(0, 1).toUpperCase()
                            }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.ServiceName }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row justify="center">
                                <v-col cols="12">
                                    <g-label>状态：</g-label>
                                    <v-chip v-if="info.EnableState === 'enable'" color="indigo" text-color="white" label>
                                        启用
                                    </v-chip>
                                    <v-chip v-else color="info" text-color="white" label>
                                        禁用
                                    </v-chip>
                                </v-col>
                                <v-col cols="12">
                                    <g-label>目标服务：</g-label>
                                    <span v-for="(service,
                                        index) in info.ServiceMetaForRoute" :key="index">
                                        <v-avatar color="secondary" size="16">
                                            <span class="white--text text-h5">{{
                                                info.ServiceMetaForRoute[0].Protocol.substring(
                                                    0,
                                                    1
                                                ).toUpperCase()
                                            }}</span>
                                        </v-avatar>
                                        {{ service.ServiceName }}
                                    </span>
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-row>
                <v-col>
                    <g-info-card title="基础信息" :list="basicInfoList">
                        <template #EnableState="{ item }">
                            <v-chip v-if="info.EnableState === 'enable'" color="indigo" text-color="white" label
                                >启用</v-chip>
                            <v-chip v-else color="info" text-color="white" label >禁用</v-chip>
                        </template>
                        <template #Uri="{ item }">
                            <v-chip label  style="margin-right: 4px" color="info">{{
                                SUPPORT_TYPES_MAP[info.Uri.Type].text
                            }}</v-chip>
                            <span v-for="(path, index) in item.text.Value" :key="index" style="margin-right: 8px">
                                <v-chip label >{{ path }}</v-chip>
                            </span>
                        </template>
                        <template #Method="{ item }">
                            <span v-if="item.text && item.text.length !== 0">
                                <v-chip label  v-for="(method, index) in item.text" :key="index"
                                    style="margin-right: 8px">{{ method }}</v-chip>
                            </span>
                            <span v-else> - </span>
                        </template>
                        <template #Hosts="{ item }">
                            <span v-for="(host, index) in item.text" :key="index" style="margin-right: 8px">
                                <v-chip label >{{ host }}</v-chip>
                            </span>
                        </template>
                        <template #Priority="{ item }">
                            <v-chip  color="primary" label>
                                {{ item.text || "-" }}
                            </v-chip>
                        </template>
                    </g-info-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <g-info-card title="路由规则" v-if="_list.length">
                        <rule-list :list="_list"></rule-list>
                    </g-info-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <g-info-card title="目标服务">
                        <div v-for="(item, index) in info.ServiceMetaForRoute" :key="index" style="padding-bottom:24px">
                            <div :class="$style.serviceCardHead">
                                <v-avatar color="secondary" size="16">
                                    <span class="white--text text-h5">{{
                                        info.ServiceMetaForRoute[0].Protocol.substring(
                                            0,
                                            1
                                        ).toUpperCase()
                                    }}</span>
                                </v-avatar>
                                <b style="margin:0 8px">{{ item.ServiceName }}</b>
                                <v-chip label >{{ item.Weight }}%</v-chip>
                            </div>
                            <div v-if="item.DestinationServices &&
                                item.DestinationServices.length !== 0
                                " :class="$style.serviceCardBody">
                                <div v-for="(subset,
                                    index) in item.DestinationServices" :key="index" style="margin-bottom: 12px">
                                    <span :class="$style.span"></span>
                                    <span style="margin-right:8px">{{ subset.SubsetName }}</span>
                                    <v-chip label >{{ subset.Weight }}%</v-chip>
                                </div>
                            </div>
                        </div>
                    </g-info-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <g-info-card title="更多配置" :list="moreInfoList" v-if="info.HttpRetry.IsRetry">
                    </g-info-card>
                    <g-info-card title="更多配置" :list="otherInfoList" v-else>
                    </g-info-card>
                </v-col>
            </v-row>
            <v-row v-if="[ 'webservice', 'dubbo' ].includes(info.ServiceMetaForRoute[0].Protocol)">
                <v-col>
                    <ConvertInfo :info="info" :serviceProxyInfo="serviceProxyInfo"/>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>
<script>
import RouterRuleInfoComp from './RouterRuleInfo';
import { SUPPORT_TYPES_MAP, SUPPORT_VALUES } from './types.js';
import _ from 'lodash';
import RuleList from './RuleList.vue';
import ConvertInfo from './Convert';

export default {
    components: { RouterRuleInfoComp, RuleList, ConvertInfo },
    data() {
        return {
            info: null,
            SUPPORT_TYPES_MAP,
            serviceProxyInfo: null,
        };
    },
    computed: {
        basicInfoList() {
            const info = this.info || {};
            return [
                { label: '路由名称', text: info.Name },
                { label: '路由别名', text: info.Alias },
                { label: '目标网关', text: info.VirtualGwName },
                { label: '状态', key: 'EnableState', text: info.EnableState },
                { label: 'Path', key: 'Uri', text: info.Uri },
                { label: 'Method', key: 'Method', text: info.Method },
                { label: '域名', key: 'Hosts', text: info.Hosts },
                { label: '优先级', key: 'Priority', text: info.Priority },
                { label: '创建时间', key: 'CreateTime', text: info.CreateTime },
                { label: '更新时间', key: 'UpdateTime', text: info.UpdateTime },

            ];
        },
        moreInfoList() {
            const info = this.info || {};
            return [
                { label: '超时时间', text: info.Timeout },
                { label: '重试', text: '开启' },
                { label: '重试次数', text: info.HttpRetry.Attempts },
                { label: '重试超时时间', text: info.HttpRetry.PerTryTimeout },
                { label: '重试条件', text: info.HttpRetry.RetryOn },
            ];
        },
        otherInfoList() {
            const info = this.info || {};
            return [
                { label: '超时时间', text: info.Timeout },
                { label: '重试', text: '关闭' },
            ];
        },
        _list() {
            const info = this.info;
            const result = [];
            const model = _.cloneDeep(SUPPORT_VALUES).splice(3, 5);
            model.forEach(item => {
                const itemInfo = info[item.key];
                if (Array.isArray(itemInfo)) {
                    itemInfo.forEach(_item => {
                        result.push({
                            ParamName: item.text,
                            ParamKey: _item.Key,
                            ParamMethod: _item.Type,
                            ParamValue: _item.Value,
                        });
                    });
                } else if (itemInfo) {
                    result.push({
                        ParamName: item.text,
                        ParamKey: itemInfo.Key,
                        ParamMethod: itemInfo.Type,
                        ParamValue: itemInfo.Value,
                    });
                }
            });
            return result;
        },
    },
    methods: {
        loadInfo() {
            const { Id } = this.$route.query || {};
            if (!Id) {
                return this.$router.replace(
                    (this.$route.meta &&
                        this.$route.meta.breadcrumbs &&
                        this.$route.meta.breadcrumbs[0].to) ||
                    '/'
                );
            }
            return this.axios({
                action: 'DescribeRoute',
                params: {
                    Id,
                },
            }).then(({ Route = {} }) => {
                this.info = Route;
            });
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
<style module>
.serviceCardHead {
    height: 40px;
    background: #fafcfe;
    padding: 12px;
}

.serviceCardBody {
    padding: 24px 12px;
    margin-bottom: 12px;
}

.span {
    display: inline-block;
    height: 14px;
    vertical-align: middle;
    background: #37f;
    width: 4px;
    margin-right: 8px;
}
</style>
