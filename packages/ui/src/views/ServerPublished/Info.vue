<template>
    <v-container fluid>
        <v-breadcrumbs
            class="pl-3"
            v-if="$route.meta && $route.meta.breadcrumbs"
            large
            :items="$route.meta.breadcrumbs"
        >
        </v-breadcrumbs>
        <div v-if="info">
            <v-card
                class="mx-auto mb-4"
            >
                <v-list-item two-line>
                    <v-list-item-avatar
                        tile
                        size="64"
                    >
                        <v-avatar
                            color="secondary"
                            size="64"
                        >
                            <span class="white--text text-h5">{{ info.ServiceName.substring(0, 2).toUpperCase() }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.ServiceName }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row dense>
                                <v-col cols="12">
                                    <g-label>服务类型：</g-label>
                                    <v-chip
                                        color="info"
                                        label
                                        x-small
                                    >
                                        {{ info.ServiceType && info.ServiceType.toUpperCase() || '-' }}
                                    </v-chip>
                                </v-col>
                                <v-col cols="12">
                                    <g-label>所属网关：</g-label>
                                    <span>{{ info.GwName || '-' }}</span>
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-row>
                <v-col>
                    <g-info-card
                        title="基础信息"
                        :list="basicInfoList">
                        <template #ServiceType="{ item }">
                            <v-chip
                                color="info"
                                x-small
                                label
                            >
                                {{ item.text && item.text.toUpperCase() || '-' }}
                            </v-chip>
                        </template>
                    </g-info-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <g-info-card
                        title="发布详情"
                        :list="publishedInfoList">
                    </g-info-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            info: null,
        };
    },
    computed: {
        basicInfoList() {
            const info = this.info || {};
            return [
                { label: '服务标识', text: info.ServiceTag },
                { label: '服务类型', key: 'ServiceType', text: info.ServiceType },
                { label: '创建时间', key: 'CreateTime', text: info.CreateTime },
                { label: '修改时间', key: 'UpdateTime', text: info.UpdateTime },
                // { label: '备注信息', text: info.Description },
            ];
        },
        publishedInfoList() {
            const info = this.info || {};
            const list = [
                { label: '所属网关', text: info.GwName },
                // { label: '备注信息', text: info.Description },
            ];
            switch (info.PublishType) {
                case 'DYNAMIC': {
                    const RegistryCenterTypeMap = {
                        Kubernetes: 'K8S 注册中心',
                    };
                    list.push({ label: '发布方式', text: '从注册中心同步' });
                    list.push({ label: '注册中心', text: RegistryCenterTypeMap[info.RegistryCenterType] });
                    list.push({ label: '应用名称', text: info.BackendService });
                    break;
                }
                case 'STATIC': {
                    list.push({ label: '发布方式', text: '静态地址' });
                    list.push({ label: '服务协议', text: info.PublishProtocol && info.PublishProtocol.toUpperCase() });
                    list.push({ label: '服务地址', text: info.BackendService });
                    break;
                }
                default:
                    break;
            }
            return list;
        },
    },
    methods: {
        loadInfo() {
            const { Id, gwId } = this.$route.query || {};
            if (!Id || !gwId) {
                return this.$router.replace(this.$route.meta && this.$route.meta.breadcrumbs && this.$route.meta.breadcrumbs[0].to || '/');
            }
            return this.axios({
                action: 'DescribeServiceProxy',
                params: {
                    ServiceId: Id,
                    GwId: gwId,
                },
            }).then(({ ServiceProxy = {} }) => {
                this.info = ServiceProxy;
            });
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
