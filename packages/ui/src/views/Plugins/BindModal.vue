<template>
    <g-modal-form
        :title="isEdit ? '更新插件' : '绑定插件'"
        visible
        :submit="handleSubmit"
        @close="handleClose"
        maxWidth="860px"
    >
        <div v-if="PluginInfo">
            <h3 class="title font-weight primary--text mb-2">
                <span>{{ PluginInfo.PluginName }}</span>
            </h3>
            <div class="font-weight-light mb-2">作者：{{ PluginInfo.Author }}</div>
            <div class="font-weight mb-4">{{ PluginInfo.InstructionForUse }}</div>
            <v-divider class="mb-2"></v-divider>
        </div>
        <v-container fluid v-if="PluginInfo" style="height: calc(70vh - 230px); overflow: auto;">
            <template v-if="!isEdit">
                <ss-form-schema ref="ssformSchemaRef" :schema="schema"></ss-form-schema>
            </template>
            <template v-else-if="data">
                <ss-form-schema ref="ssformSchemaRef" v-model="data" :schema="schema"></ss-form-schema>
            </template>
        </v-container>

    </g-modal-form>
</template>
<script>
import _ from 'lodash';
import { ValidationProvider } from 'vee-validate';
export default {
    components: {
        ValidationProvider,
    },
    props: {
        gwId: [ String, Number ],
        routeId: [ String, Number ],
        DomainId: [ String, Number ],
        current: Object,
        scope: String,
        type: {
            type: String,
            default: 'add',
        },
    },
    data: () => ({
        PluginBindingInfo: null, // edit
        PluginInfo: null,
        data: null,
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
        PluginType() {
            if (this.PluginInfo) {
                return this.PluginInfo.PluginType;
            }
            return this.current.PluginType;
        },
        GwId() {
            return this.current && this.current.VirtualGwId || this.gwId;
        },
        RouteId() {
            return this.PluginBindingInfo && this.PluginBindingInfo.BindingObjectId || this.routeId;
        },
        schema() {
            if (this.PluginInfo && this.PluginInfo.PluginSchema) {
                const s = JSON.parse(this.PluginInfo.PluginSchema);
                return s;
            }
            return null;
        },
        PluginBindingInfoId() { // edit
            return this.current.PluginBindingInfoId;
        },
    },
    methods: {
        loadBindingPluginInfo() {
            return this.axios({
                action: 'DescribeBindingPlugin',
                params: {
                    VirtualGwId: this.GwId,
                    PluginBindingInfoId: this.PluginBindingInfoId,
                },
            }).then(({ PluginBindingInfo = {} } = {}) => {
                this.PluginBindingInfo = PluginBindingInfo;
                this.data = JSON.parse(PluginBindingInfo.PluginConfiguration);
            });
        },
        loadPluginInfo() {
            return this.axios({
                action: 'DescribePluginInfo',
                params: {
                    VirtualGwId: this.GwId,
                    PluginType: this.PluginType,
                },
            }).then(({ PluginInfo = {} } = {}) => {
                this.PluginInfo = PluginInfo;
            });
        },
        handleSubmit() {
            const ssformSchemaRef = this.$refs.ssformSchemaRef;
            if (ssformSchemaRef) {
                const config = ssformSchemaRef.getValue();
                console.info('config:', config);
                let action = Promise.resolve();
                if (this.isEdit) {
                    action = this.axios({
                        action: 'UpdatePluginConfiguration',
                        data: {
                            PluginBindingInfoId: this.PluginBindingInfoId,
                            PluginConfiguration: JSON.stringify(config),
                        },
                    });
                } else {
                    action = this.axios({
                        action: 'BindingPlugin',
                        data: {
                            BindingObjectId: this.RouteId || this.DomainId,
                            BindingObjectType: this.scope,
                            VirtualGwId: this.GwId,
                            PluginConfiguration: JSON.stringify(config),
                            PluginType: this.PluginType,
                            PluginName: this.current.PluginName,
                        },
                    });
                }
                action.then(() => {
                    this.$notify.success(this.isEdit ? '更新成功' : '创建成功');
                    this.handleClose();
                });
            }
        },
        handleClose() {
            this.$emit('close');
        },
    },
    async created() {
        await this.loadPluginInfo();
        if (this.isEdit) {
            await this.loadBindingPluginInfo();
        }
    },
};
</script>

