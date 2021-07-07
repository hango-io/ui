<template>
    <v-dialog
      :value="visible"
      @input="handleClose"
      persistent
      :max-width="maxWidth"
      v-bind="$attrs"
    >
      <v-card>
        <validation-observer
            ref="observer"
            v-slot="{ invalid }"
        >
        <v-card-title>
          <span :class="$style.headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
            <form>
                <slot></slot>
            </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="cancelText"
            color="error"
            text
            @click="handleClose"
          >
            {{ cancelText }}
          </v-btn>
          <v-btn
            v-if="okText"
            color="primary"
            text
            type="submit"
            :disabled="invalid"
            @click="handleSubmit"
          >
            {{ okText }}
          </v-btn>
        </v-card-actions>
        </validation-observer>
      </v-card>
    </v-dialog>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
export default {
    name: 'g-modal-form',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    props: {
        title: String,
        visible: Boolean,
        maxWidth: {
            type: String,
            default: '600px',
        },
        submit: {
            type: Function,
            default: () => {},
        },
        cancelText: {
            type: String,
            default: '取消',
        },
        okText: {
            type: String,
            default: '确认',
        },
    },
    data: () => ({
    }),
    methods: {
        async handleSubmit() {
            const valid = await this.$refs.observer.validate();
            if (!valid) {
                this.$notify.error('参数错误！校验失败！');
                return;
            }
            return this.submit(true);
        },
        handleClose() {
            this.dialogVisiable = false;
            this.$refs.observer.reset();
            this.$emit('close');
        },
    },
};
</script>

<style lang="scss" module>
.headline {
}
</style>
