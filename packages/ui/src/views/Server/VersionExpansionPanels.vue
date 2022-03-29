<template>
    <div>
        <div v-if="$slots.title">
            <slot name="title"></slot>
        </div>

        <v-expansion-panels :class="$style.pannels" focusable popout accordion>
            <v-expansion-panel v-for="(item, i) in panelList" :key="i">
                <v-expansion-panel-header>
                    <validation-provider
                        v-slot="{ errors }"
                        name="版本名称"
                        rules="required"
                    >
                        <v-text-field
                            v-model="item.Name"
                            disabled
                            label="版本名称"
                            :error-messages="errors"
                            required
                        ></v-text-field>
                    </validation-provider>
                    <v-btn :class="$style.delBtn" text color="error" @click.native="handleRemove(item, i)">删除</v-btn>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <validation-provider
                        v-slot="{ errors }"
                        name="版本名称"
                        rules="required"
                    >
                        <v-text-field
                            v-model="item.Name"
                            label="版本名称*"
                            :error-messages="errors"
                            required
                        ></v-text-field>
                    </validation-provider>

                    <template v-if="isDYNAMIC">
                        <g-label>标签</g-label>
                        <div style="padding-left: 20px">
                            <validation-provider
                                v-slot="{ errors }"
                                name="标签 Key"
                                rules="required"
                            >
                                <v-text-field
                                    v-model="item.Labels[0].Key"
                                    label="Key*"
                                    :error-messages="errors"
                                    required
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider
                                v-slot="{ errors }"
                                name="标签 Value"
                                rules="required"
                            >
                                <v-text-field
                                    v-model="item.Labels[0].Value"
                                    label="Value*"
                                    :error-messages="errors"
                                    required
                                ></v-text-field>
                            </validation-provider>
                        </div>
                    </template>
                    <template v-else>
                        <validation-provider
                            v-slot="{ errors }"
                            name="服务地址"
                            rules="required"
                        >
                            <v-select
                                v-model="item.StaticAddrList"
                                :items="staticAddrList || []"
                                :menu-props="{ maxHeight: '400' }"
                                label="服务地址*"
                                multiple
                                hint="请选择"
                                persistent-hint
                                :error-messages="errors"
                                required
                            ></v-select>
                        </validation-provider>
                    </template>

                    <!-- 更多配置 -->
                    <MoreConfig v-model="item.TrafficPolicy"
                        :publishType="publishType">
                        <g-label slot="title">更多配置</g-label>
                    </MoreConfig>

                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-btn @click="handleAdd" block :disabled="panelList.length >= max">
        {{ addText }}
        </v-btn>
    </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import MoreConfig from './MoreConfig';
const TEMPLATE_MODAL = {
    Name: '',
    Labels: [{
        key: '',
        value: '',
    }],
    TrafficPolicy: {

    },
    StaticAddrList: [],
};
export default {
    components: {
        ValidationProvider, MoreConfig,
    },
    model: {
        props: 'panel',
        event: 'update',
    },
    props: {
        panel: {
            type: Array,
            default: () => ([]),
        },
        max: {
            type: Number,
            default: 5,
        },
        addText: {
            type: String,
            default: '增加一条',
        },
        publishType: { // 发布类型
            type: String,
            required: true,
        },
        staticAddrList: {
            type: Array,
            default: () => ([]),
        },
    },
    data() {
        return {
            panelList: this.panel || [],
        };
    },
    computed: {
        isDYNAMIC() {
            return this.publishType === 'DYNAMIC';
        },
    },
    watch: {
        panel(nV, oV) {
            if (nV !== oV) {
                this.panelList = nV || [];
            }
        },
    },
    methods: {
        handleAdd() {
            this.panelList.push({
                ...JSON.parse(JSON.stringify(TEMPLATE_MODAL)),
            });
            this.$emit('update', this.panelList);
        },
        handleRemove(item) {
            this.panelList = this.panelList.filter(d => d !== item);
            this.$emit('update', this.panelList);
        },
    },
};
</script>

<style lang="scss" module>
.pannels {
    padding: 10px 0;
}
.delBtn {
    position: absolute;
    right: 60px;
}
</style>
