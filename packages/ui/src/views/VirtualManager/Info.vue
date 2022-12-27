<template>
    <v-container fluid>
        <v-breadcrumbs class="pl-3" v-if="$route.meta && $route.meta.breadcrumbs" large :items="$route.meta.breadcrumbs"></v-breadcrumbs>
        <div>
            <v-card class="mx-auto mb-4">
                <v-list-item two-line>
                    <v-list-item-avatar tile size="54">
                        <v-avatar color="secondary" size="54">
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
                                    <g-label>类型:</g-label>
                                    <v-chip text-color="white" label x-small>{{ info.apiType && info.apiType.toUpperCase() || '-' }}</v-chip>
                                </v-col>
                            </v-row>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-row>
                <!-- 基础信息 -->
                <v-col></v-col>
            </v-row>
            <v-row>
                <!-- gateway -->
                <v-col></v-col>
            </v-row>
            <v-row>
                <!-- http route -->
                <v-col></v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {},
    created() {
        console.log(this.$route.meta);
    },
};
</script>

<style>
</style>
