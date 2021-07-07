<template>
    <g-modal-form
        title="添加插件"
        visible
        @close="handleClose"
        okText=""
    >
        <validation-provider
            v-slot="{ errors }"
            name="目标网关"
            rules="required"
        >
            <g-publish-route-select
                v-model="RouteId"
                label="目标已发布路由*"
                :error-messages="errors"
                @input="handleRouteChange"
                required
            ></g-publish-route-select>
        </validation-provider>

        <template v-if="RouteId">
            <div class="pb-4" style="max-height: 520px; overflow: auto;">
                <v-item-group>
                    <v-row>
                        <v-col
                        v-for="item in PluginList"
                        :key="item.PluginType"
                        cols="12"
                        md="4"
                        >
                        <v-item>
                            <v-hover v-slot="{ hover }">
                                <v-card
                                    height="150"
                                    style="overflow: auto;"
                                >
                                    <div :class="$style.cardItem">
                                        <h3 class="title font-weight primary--text mb-2">
                                            <span>{{ item.PluginName }}</span>
                                        </h3>
                                        <div class="font-weight grey--text mb-2">作者：{{ item.Author }}</div>
                                        <div class="font-weight mb-2">{{ item.InstructionForUse }}</div>
                                    </div>
                                    <v-expand-transition>
                                        <v-btn v-if="hover" style="position: absolute; bottom: 0;" block color="primary"
                                            @click="handleClick(item)">
                                            绑定
                                        </v-btn>
                                    </v-expand-transition>
                                </v-card>
                            </v-hover>
                        </v-item>
                        </v-col>
                    </v-row>
                </v-item-group>
            </div>
            <BindModalComp v-if="!!current" :routeId="RouteId" :gwId="GwId" :current="current" @close="handleCloseBindModal"></BindModalComp>
        </template>
    </g-modal-form>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
import BindModalComp from './BindModal';
export default {
    components: {
        ValidationProvider,
        BindModalComp,
    },
    data: () => ({
        GwId: '',
        RouteId: '',
        GwList: [],
        PluginList: [],
        current: null,
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
    },
    methods: {
        handleRouteChange(id, item) {
            this.GwId = item.GwId;
            this.loadPluginList();
        },
        loadPluginList() {
            this.PluginList = [];
            return this.axios({
                action: 'DescribePluginInfoList',
                data: {
                    PluginScope: 'routeRule',
                },
            }).then(({ PluginDtoList = [] } = {}) => {
                this.PluginList = PluginDtoList;
            });
        },
        handleClose() {
            this.handleCloseBindModal();
            this.$emit('close');
        },
        handleCloseBindModal() {
            this.current = null;
        },
        handleClick(row) {
            this.current = row;
            console.info(row);
        },
    },
};
</script>

<style module>
.cardItem {
    height: 100%;
    padding: 5px;
}
</style>
