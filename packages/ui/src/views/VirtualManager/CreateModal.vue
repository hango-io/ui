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
        :disabled="isEdit"
      ></v-text-field>
    </validation-provider>
    <validation-provider v-slot="{ errors }" name="类型" rules="required">
      <v-select
        v-model="form.Type"
        :items="typeList"
        label="类型*"
        :error-messages="errors"
        required
        :disabled="isEdit"
      ></v-select>
    </validation-provider>
    <validation-provider v-slot="{ errors }" name="所属网关" rules="required">
      <v-select
        v-model="form.GwId"
        label="所属网关*"
        :items="gwList"
        :error-messages="errors"
        required
        :disabled="isEdit"
      ></v-select>
    </validation-provider>
    <validation-provider v-slot="{ errors }" name="监听协议" rules="required">
      <v-select
        v-model="form.Protocol"
        label="监听协议*"
        :items="protocolList"
        :error-messages="errors"
        required
        :disabled="isEdit"
      ></v-select>
    </validation-provider>
    <validation-provider v-slot="{ errors }" name="监听端口" rules="required">
      <v-text-field
        v-model="form.Port"
        label="监听端口*"
        :error-messages="errors"
        required
        :disabled="isEdit"
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
        allType: [
            { id: 'ApiGateway', label: 'API网关' },
            { id: 'LoadBalance', label: '负载均衡' },
            { id: 'NetworkProxy', label: '通用网关' },
        ],
        protocolList: [ 'HTTP', 'HTTPS' ],
        gwList: [],
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
        typeList() {
            return this.allType.map(item => {
                return {
                    ...item,
                    text: item.label,
                    value: item.id,
                };
            });
        },
    },
    watch: {
        current: {
            handler(newVal) {
                if (newVal && this.isEdit) {
                    this.load();
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        load() {
            this.form = JSON.parse(JSON.stringify(this.current));
        },
        handleSubmit() {
            const params = JSON.parse(JSON.stringify(this.form));
            return this.axios({
                action: this.isEdit ? 'UpdateVirtualGateway' : 'CreateVirtualGateway',
                data: {
                    ...params,
                },
            }).then(() => {
                this.$notify.success(this.isEdit ? '虚拟网关更新成功' : '虚拟网关创建成功');
                this.handleClose();
            });
        },
        handleClose() {
            this.$emit('close');
        },
        getGwList(params) {
            return this.axios({
                action: 'DescribeAllGateway',
                params: {
                    ...params,
                },
            }).then(({ Result = [] }) => {
                this.gwList = Result.map(item => {
                    return {
                        ...item,
                        text: item.Name,
                        value: item.GwId,
                    };
                });
            });
        },
    },
    created() {
        this.getGwList();
    },
};
</script>
