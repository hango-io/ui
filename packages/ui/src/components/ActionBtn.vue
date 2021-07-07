<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="mr-2"
                small
                :disabled="disabled"
                :color="color"
                icon
                v-bind="{ ...attrs, ...$attrs }"
                v-on="{ ...on, ...$listeners }"
            >
                <v-icon size="20">{{ icon }}</v-icon>
                <slot></slot>
            </v-btn>
        </template>
        <span>{{ tooltip }}</span>
    </v-tooltip>
</template>

<script>
export default {
    props: {
        color: String,
        disabled: Boolean,
        icon: String,
        tooltip: String,
    },
    data() {
        return {

        };
    },
};
</script>
