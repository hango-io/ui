<template>
    <g-modal-form
        title="创建网关"
        visible
        :submit="handleSubmit"
        @close="handleClose"
    >
        <validation-provider
            v-slot="{ errors }"
            name="虚拟网关名称"
            rules="required"
        >
            <v-text-field
                v-model="form.Name"
                label="虚拟网关名称*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <validation-provider
            v-slot="{ errors }"
            name="虚拟网关标识"
            rules="required"
        >
            <v-text-field
                v-model="form.Code"
                label="虚拟网关标识*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="类型" rules="required">
              <g-publish-route-select
                v-model="form.Type"
                label="类型*"
                :error-messages="errors"
                @input="handleRouteChange"
                required
            ></g-publish-route-select>
        </validation-provider>
        <validation-provider
            v-slot="{ errors }"
            name="所属网关"
            rules="required"
        >
            <v-text-field
                v-model="form.GwId"
                label="所属网关*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <validation-provider
            v-slot="{ errors }"
            name="监听协议"
            rules="required"
        >
            <v-text-field
                v-model="form.Protocol"
                label="监听协议*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <validation-provider
            v-slot="{ errors }"
            name="监听端口"
            rules="required"
        >
            <v-text-field
                v-model="form.Port"
                label="监听端口*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="访问地址">
            <v-text-field
                v-model="form.Addr"
                label="访问地址"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="备注信息">
            <v-textarea
                v-model="form.Description"
                label="备注信息"
                :error-messages="errors"
            ></v-textarea>
        </validation-provider>
    </g-modal-form>
</template>
<script>
const TEMPLATE_MODEL = {
    Name: '',
    Code: '',
    Type: '',
    GwId: '',
    Protocol: '',
    Port: '',
    Addr: '',
    Description: '',
};
import _ from 'lodash';
import { ValidationProvider } from 'vee-validate';
export default {
    components: {
        ValidationProvider,
    },
    props: {
        current: Object,
        type: {
            type: String,
            default: 'add',
        },
    },
    data: () => ({
        form: JSON.parse(JSON.stringify(TEMPLATE_MODEL)),
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
    },
    methods: {
        handleSubmit() {
            // return this.axios({
            //     action: this.isEdit ? 'UpdateGateway' : 'CreateGateway',
            //     data: {
            //         ...this.form,
            //     },
            // }).then(() => {
            //     this.$notify.success(this.isEdit ? '更新成功' : '创建成功');
            //     this.handleClose();
            // });
        },
        handleClose() {
            this.$emit('close');
        },
    },
    created() {
        if (this.isEdit) {
            this.form = JSON.parse(
                JSON.stringify(
                    _.pick(this.current, [
                        'GwId',
                        ...Object.keys(TEMPLATE_MODEL),
                    ])
                )
            );
        }
    },
};
</script>
