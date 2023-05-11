<template>
  <g-modal-form
    :title="type==='edit'?'修改虚拟网关':'创建虚拟网关'"
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
        hint="只支持字母、中文、数字、下划线、中划线或‘.’组成"
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
        hint="最小两位,只支持由小写字母数字字符、“-”组成,必须以字母数字字符开头、结尾"
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
        hint="请输入80-65535间的端口号,15000-20000为平台预留端口"
      ></v-text-field>
    </validation-provider>
    <validation-provider name="域名">
          <v-select :items="HostsList" multiple item-text="Host" item-value="DomainId" v-model="form.VirtualHostList" label="域名"></v-select>
      </validation-provider>
    <validation-provider v-slot="{ errors }" name="访问地址">
      <v-text-field
        v-model="form.Addr"
        label="访问地址"
        :error-messages="errors"
        required
        hint="请输入http://或者https://开头的网关地址"
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
    VirtualHostList: [],
    Description: '',
};
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
        HostsList: [],
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
            if (this.current.DomainInfos && this.current.DomainInfos.length) {
                const arr = this.current.DomainInfos.map(item => item.DomainId);
                // this.current.VirtualHostList.forEach((item, index) => {
                //     this.$set(arr, index, { value: item });
                // });
                this.form.VirtualHostList = arr;
            }
        },
        handleSubmit() {
            const params = JSON.parse(JSON.stringify(this.form));
            return this.axios({
                action: this.isEdit ? 'UpdateVirtualGateway' : 'CreateVirtualGateway',
                data: {
                    ...params,
                },
            }).then(({ Result = '' }) => {
                this.axios({
                    action: 'BindDomainInfo',
                    data: {
                        VirtualGwId: Result,
                        DomainIds: this.form.VirtualHostList,
                    },
                }).then(() => {
                    this.axios({
                        action: 'UpdateProjectBinding',
                        data: {
                            VirtualGwId: Result,
                            ProjectIdList: [ 1 ],
                        },
                    }).then(() => {
                        this.$notify.success(this.isEdit ? '虚拟网关更新成功' : '虚拟网关创建成功');
                        this.handleClose();
                    });
                });
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
        loadDomain() {
            return this.axios({
                action: 'DescribeDomainList',
                data: {
                    VirtualGwId: '',
                },
            }).then(({ Result = [] }) => {
                this.HostsList = Result;
            });
        },
        appendIconCallback(index) {
            if (this.form.VirtualHostList.length < 2) {
                this.$notify.warn('请输入至少一个域名');
                return;
            }
            this.form.VirtualHostList.splice(index, 1);
        },
    },
    created() {
        this.getGwList();
        this.loadDomain();
    },
};
</script>
