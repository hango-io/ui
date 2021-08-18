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
                        size="54"
                    >
                        <v-avatar
                            color="secondary"
                            size="54"
                        >
                            <span class="white--text text-h5">{{ info.ServiceName.substring(0, 2).toUpperCase() }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-2">
                            <span>{{ info.ServiceName }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-row justify="center">
                                <v-col>
                                    <g-label>服务类型：</g-label>
                                    <v-chip
                                        color="info"
                                        label
                                        x-small
                                    >
                                        {{ info.ServiceType && info.ServiceType.toUpperCase() || '-' }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
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
                <template #PublishedStatus="{ item }">
                    <v-chip
                        :color="+item.text === 1 ? 'success' : ''"
                        label
                        x-small
                    >
                        {{ +item.text === 1 ? '已发布' : '未发布' }}
                    </v-chip>
                </template>
            </g-info-card>
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
                { label: '发布状态', key: 'PublishedStatus', text: info.PublishedStatus },
                { label: '创建时间', key: 'CreateDate', text: info.CreateDate },
                { label: '修改时间', key: 'ModifyDate', text: info.ModifyDate },
                { label: '备注信息', text: info.Description },
            ];
        },
    },
    methods: {
        loadInfo() {
            const { Id } = this.$route.query || {};
            if (!Id) {
                return this.$router.replace(this.$route.meta && this.$route.meta.breadcrumbs && this.$route.meta.breadcrumbs[0].to || '/');
            }
            return this.axios({
                action: 'DescribeServiceById',
                params: {
                    ServiceId: Id,
                },
            }).then(({ ServiceInfoBasic = {} }) => {
                this.info = ServiceInfoBasic;
            });
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
