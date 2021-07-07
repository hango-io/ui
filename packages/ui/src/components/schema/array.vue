<template>
    <div :class="$style.root" :level="layout.level">
        <div :class="$style.subHeader">
            <template v-if="!isView">
                <div :class="$style.title">
                    <v-avatar left
                        size="16"
                        class="primary white--text"
                    >{{ layout.index + 1 }}</v-avatar>
                    <span class="ml-2">{{ schema.alias }}</span>
                </div>
                <v-btn color="error" text @click="subArrayRemoveItem(layout.index)">删除</v-btn>
            </template>
        </div>
        <div :class="$style.subBody">
            <slot>
                <span size="big" style="color: red;">System Error!!!</span>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ss-form-schema-array',
    props: {
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
        subArrayRemoveItem(index) {
            if (this.layout.parent) {
                this.layout.parent.removeChildLayout(index);
            }
        },
    },
};
</script>

<style module>
.root {
    position: relative;
}
.title {
    color: #666666;
    vertical-align: middle;
}
.subBody {
    position: relative;
    padding: 5px 10px;
    border: dashed 1px #ccc;
    border-top: none;
}
.subHeader {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    padding-left: 10px;
    background: rgba(38, 73, 129, 0.2);
}
</style>
