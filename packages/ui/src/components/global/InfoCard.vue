<template>
    <v-card
        class="mx-auto mb-4"
    >
        <v-card-title v-if="!!title" :class="$style.tit">
            {{ title }}
            <slot name="extra"></slot>
        </v-card-title>
        <slot>
            <v-row v-for="(row, rIndex) in _list" :key="rIndex">
                <v-col v-for="(col, cIndex) in row" :key="cIndex"
                    cols="12"
                    md="6">
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-subtitle>
                                <g-label>{{ col.label }}</g-label>
                            </v-list-item-subtitle>
                            <v-list-item-title>
                                <slot v-if="col.key" :name="col.key" :item="col">
                                    <span v-if="['CreateTime','UpdateTime','CreateDate','ModifyDate'].includes(col.key)">{{ col.text | smartTimestamp }}</span>
                                    <span v-else>{{ col.key || '-' }}</span>
                                </slot>
                                <span v-else style="white-space: normal">{{ col.text || '-' }}</span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
            </v-row>
        </slot>
    </v-card>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'g-info-card',
    props: {
        title: String,
        list: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        _list() {
            return _.chunk(this.list, 2);
        },
    },
};
</script>
<style lang="scss" module>
.tit{
    justify-content: space-between;
}
</style>
