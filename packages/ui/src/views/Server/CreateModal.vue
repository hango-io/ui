<template>
    <g-modal-form :title="isEdit ? '修改服务' : '创建服务'" :okText="isEdit ? '保存' : '创建'" visible :submit="handleSubmit" @close="handleClose">
        <validation-provider v-slot="{ errors }" name="协议类型" rules="required">
            <v-radio-group label="服务类型" v-model="form.ServiceType" row :error-messages="errors">
                <v-radio v-for="item in ProtocolType" :key="item.value" :disabled="isEdit" :label="item.text" :value="item.value"></v-radio>
            </v-radio-group>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="服务名称" rules="required">
            <v-text-field v-model="form.ServiceName" label="服务名称*" :error-messages="errors" required></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="服务标识" rules="required">
            <v-text-field v-model="form.ServiceTag" label="服务标识*" :error-messages="errors" required></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="备注信息">
            <v-textarea v-model="form.Description" label="备注信息" :error-messages="errors"></v-textarea>
        </validation-provider>
    </g-modal-form>
</template>
<script>
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
        form: {
            ServiceName: '',
            ServiceType: 'http',
            ServiceTag: '',
            Description: '',
            Contacts: 'admin',
        },
        ProtocolType: [
            {
                text: 'HTTP',
                value: 'http',
            },
            {
                text: 'Dubbo',
                value: 'dubbo',
            },
        ],
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
    },
    methods: {
        handleSubmit() {
            return this.axios({
                action: this.isEdit ? 'UpdateService' : 'CreateService',
                data: {
                    ...this.form,
                },
            }).then(() => {
                this.$notify.success(this.isEdit ? '更新成功' : '创建成功');
                this.handleClose();
            });
        },
        handleClose() {
            this.$emit('close');
        },
    },
    created() {
        if (this.isEdit) {
            this.form = JSON.parse(JSON.stringify(this.current));
        }
    },
};
</script>

