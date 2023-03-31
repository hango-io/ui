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
        </div>
    </v-container>
</template>
<script>
import handleApplicationName from '@/components/utils/applicationName.js';
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
                { label: '服务别名', text: info.Alias },
                { label: '协议类型', text: info.Protocol },
                { label: '应用名称', text: handleApplicationName(info.BackendService) },
                { label: '域名', text: info.Hosts },
                { label: '创建时间', key: 'CreateDate', text: info.CreateTime },
                { label: '修改时间', key: 'ModifyDate', text: info.UpdateTime },
                { label: '备注信息', text: info.Description },
            ];
        },
    },
    methods: {
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
            });
        },
    },
    created() {
        this.loadInfo();
    },
};
</script>
