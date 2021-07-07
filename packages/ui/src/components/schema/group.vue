<template>
    <div :class="$style.root" :level="layout.level">
        <div :class="$style.subHeader" v-if="!hiddenHeader">
            <span>{{ schema.alias }}</span>
        </div>
        <div :class="$style.subBody" :style="hiddenHeader ? {} : { marginLeft: level * 15 + 'px' }">
            <!-- {{ level }} -->
            <slot></slot>
            <div v-if="layout.isDynamicLayoutType" :class="$style.tools">
                <v-btn color="primary" block @click="handleAddLine">添加一条</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ss-form-schema-group',
    props: {
        hiddenHeader: Boolean,
        layout: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
        };
    },
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
        isView() {
            return this.type === 'view';
        },
        schema() {
            const layout = this.layout || {};
            return layout.schema;
        },
        level() {
            const layout = this.layout || {};
            return layout.level;
        },
    },
    methods: {
        handleAddLine() {
            return this.layout.addChildLayout();
        },
    },
};
</script>

<style module>
.root {
    position: relative;
    /* border-left: dashed 1px #cccccc; */
}
.subBody {
    position: relative;
    padding: 5px 0px;
}
.tools {
    margin: 10px 0;
}
.subHeader {
    position: relative;
    overflow: hidden;
}
</style>
