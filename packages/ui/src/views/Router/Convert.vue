<template>
  <!-- 已发布路由协议转换 -->
    <v-row>
        <v-col>
            <v-card
                class="mx-auto mb-4"
            >
                <v-card-title>协议转换</v-card-title>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle>
                            <v-row>
                                <v-col cols="12">
                                    <g-label>是否启用：</g-label>
                                    <span>{{enabledSwitchFlag | enabledSwitchFlag}}</span>
                                </v-col>
                                <template v-if="enabledSwitchFlag">
                                    <v-col cols="12" v-if="convertInfo && !convertInfo.MethodWorks">
                                        <v-alert
                                            outlined
                                            dense
                                            type="warning"
                                            text
                                        >
                                            该Method已经失效，需重新进行配置
                                        </v-alert>
                                    </v-col>
                                    <v-col cols="12">
                                        <g-label>Dubbo Method：</g-label>
                                        {{ convertInfo.Method || '-' }}
                                    </v-col>
                                    <v-col cols="12">
                                        <v-alert
                                            :class="$style.tips"
                                            outlined
                                            dense
                                            type="info"
                                            text
                                        >
                                            <div style="color:#666;">
                                                如所属服务的method已经更新，请点击刷新以更新所属服务的method列表
                                                <span @click="RefreshDubboMeta" style="color:#09f;cursor:pointer;">刷新
                                                    <v-icon left small :class="$style.icon" :loading="loadingDubboMeta">mdi-refresh</v-icon>
                                                </span>
                                            </div>
                                        </v-alert>
                                        <v-progress-linear
                                            v-show="loadingDubboMeta"
                                            indeterminate
                                            rounded
                                        ></v-progress-linear>
                                    </v-col>
                                    <v-col cols="12">
                                        <g-label>参数来源：</g-label>
                                        {{ convertInfo.ParamSource || '-' }}
                                    </v-col>
                                    <v-col cols="12">
                                        <v-data-table
                                            :headers="paramHeaders"
                                            :items="convertInfo.Params"
                                            hide-default-footer
                                        >
                                            <template #item.serialNumber="{ index }">
                                                <span>{{ index + 1 }}</span>
                                            </template>
                                            <template #item.Value="{ item }">
                                                <span>{{ item.Value }}</span>
                                            </template>
                                            <template #item.Key="{ item }">
                                                {{ item.Key }}
                                            </template>
                                            <template #item.Required="{ item }">
                                                {{ item.Required ? '是' : '否' }}
                                            </template>
                                            <template #item.DefaultValue="{ item }">
                                                {{ item.DefaultValue }}
                                            </template>
                                            <template #item.GenericInfo="{ item }">
                                                {{ item.GenericInfo || '-' }}
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                    <v-col cols="12">
                                        <g-label>隐式参数传递</g-label>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-data-table
                                            :headers="attachmentHeaders"
                                            :items="convertInfo.Attachment"
                                            hide-default-footer
                                        ></v-data-table>
                                    </v-col>
                                </template>
                        </v-row>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: [ 'info', 'serviceProxyInfo' ],
    filters: {
        Required(val) {
            if (val) {
                return '是';
            }
            return '否';
        },
        enabledSwitchFlag(val) {
            if (val) {
                return '已启用';
            }
            return '未启用';
        },
    },
    data() {
        return {
            paramHeaders: [
                { text: '序号', value: 'serialNumber', sortable: false },
                { text: '类型', value: 'Value', sortable: false },
                { text: '参数名', value: 'Key', sortable: false },
                { text: '必填', value: 'Required', sortable: false },
                { text: '默认值', value: 'DefaultValue', sortable: false },
                { text: '泛型配置', value: 'GenericInfo', sortable: false },
            ],
            attachmentHeaders: [
                { text: '参数来源', value: 'ParamPosition', sortable: false },
                { text: '参数名', value: 'ClientParamName', sortable: false },
                { text: '隐式参数名', value: 'ServerParamName', sortable: false },
                { text: '描述', value: 'Description', sortable: false },
            ],
            convertInfo: {
                MethodWorks: true,
                Params: [],
                Attachment: [],
            },
            enabledSwitchFlag: false,
            loadingDubboMeta: false,
        };
    },
    computed: {
        Id() {
            if (this.$route.query) {
                return this.$route.query.Id;
            }
            return this.info ? this.info.Id : null;
        },
        ServiceType() {
            return this.info.ServiceType || '';
        },
        GwId() {
            return this.info.GwId || '';
        },
        RouteId() {
            return this.info.RouteRuleId || '';
        },
        ServiceId() {
            return this.info.ServiceId || '';
        },
    },
    watch: {
        info: {
            async handler() {
                await this.loadDubbo();
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        RefreshDubboMeta() {
            if (!this.serviceProxyInfo) return;
            const Igv = this.serviceProxyInfo.BackendService;
            const VirtualGwId = this.serviceProxyInfo.VirtualGwId;
            console.log(this.serviceProxyInfo);
            return this.axios({
                action: 'RefreshDubboMeta',
                params: {
                    Igv,
                    VirtualGwId,
                },
            }).then(() => {
                this.loadDubbo();
            });
        },
        loadDubbo() {
            const ObjectId = this.Id;
            this.loadingDubboMeta = true;
            return this.axios({
                action: 'DescribePublishedDubbo',
                params: { ObjectId, ObjectType: 'route' },
            }).then(({ Result } = {}) => {
                if (Result) {
                    this.enabledSwitchFlag = true;
                } else {
                    this.enabledSwitchFlag = false;
                }
                this.convertInfo = Result || this.convertInfo;
            }).finally(() => {
                this.loadingDubboMeta = false;
            });
        },
    },
};
</script>

<style module>
.tips{
    color: #666;
}
.icon[class]:before {
  font-size: 14px;
  vertical-align: middle;
  padding: 0;
  margin: 0 2px;
  cursor: pointer;
  color: #508ae2;
}
.icon {
  display: inline-block;
  text-align: center;
}
.icon[loading] {
  color: #508ae2;
  animation: rotate 0.6s infinite linear;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
    opacity: 0.65;
  }
  50% {
    transform: rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: rotate(359deg);
    opacity: 0.65;
  }
}
</style>
