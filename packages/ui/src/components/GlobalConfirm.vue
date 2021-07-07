<template>
    <v-dialog
      v-model="visible"
      max-width="290"
    >
      <v-card>
        <v-card-title :class="$style.headline">
            <span>{{ options.title }}</span>
        </v-card-title>

        <v-card-text>
            {{ options.message }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            color="error"
            @click="visible = false"
          >
            取消
          </v-btn>

          <v-btn
            text
            color="primary"
            @click="handleOk"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
const TEMPLATE_OPTIONS = {
    message: '',
    title: '',
    ok: () => {},
};
import _ from 'lodash';
export default {
    data() {
        return {
            visible: false,
            options: _.cloneDeep(TEMPLATE_OPTIONS),
        };
    },
    methods: {
        show(options = {}) {
            Object.assign(this.options, options);
            this.visible = true;
        },
        cancel() {
            this.visible = false;
            this.options = _.cloneDeep(TEMPLATE_OPTIONS);
        },
        async handleOk() {
            await this.options.ok();
            this.visible = false;
        },
    },
};
</script>

<style lang="scss" module>
.headline {
}
</style>
