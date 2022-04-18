<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-icon
                dense
                v-bind="{ ...attrs, ...$attrs }"
                v-on="{ ...on, ...$listeners }"
            >{{ icon }}</v-icon>
        </template>
        <span>
            <slot>{{ tooltip }}</slot>
        </span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'g-note',
    props: {
        icon: {
            type: String,
            default: 'mdi-help-box',
        },
        tooltip: String,
    },
    data() {
        return {

        };
    },
};
</script>
