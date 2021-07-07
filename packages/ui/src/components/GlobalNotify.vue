<template>
  <v-snackbar
    v-model="visible"
    :timeout="options.timeout"
    :color="options.color"
    top app
    multi-line
    shaped
    rounded
  >
    <span style="font-weight: bold">{{ options.message }}</span>
    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="visible = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
const TEMPLATE_OPTIONS = {
    message: '',
    color: '',
    timeout: 2000,
};
export default {
    data() {
        return {
            visible: false,
            options: JSON.parse(JSON.stringify(TEMPLATE_OPTIONS)),
        };
    },
    methods: {
        show(options = {}) {
            Object.assign(this.options, options);
            this.visible = true;
        },
        cancel() {
            this.visible = false;
            this.options = JSON.parse(JSON.stringify(TEMPLATE_OPTIONS));
        },
    },
};
</script>
