<template>
  <g-modal-form
    title="Dubbo 转换"
    visible
    :submit="submit"
    @close="closeModal"
    maxWidth="1100px"
  >
    <g-label>路由名称</g-label>
    <div>{{ current.RouteRuleName }}</div>
    <v-switch
        v-model="enabledSwitchFlag"
        label="是否启用"
    ></v-switch>
    <template v-if="enabledSwitchFlag">
        <validation-provider
            v-slot="{ errors }"
            name="Dubbo Method"
            rules="required"
        >
            <v-select
                @change="handleMethodChange"
                v-model="form.MethodParams"
                :items="DubboMetaMethods"
                label="Dubbo Method"
                item-text="label"
                item-value="value"
                :error-messages="errors"
                required
            ></v-select>
        </validation-provider>
        <v-alert
            v-if="!isMetaChanged"
            outlined
            dense
            type="warning"
            text
        >
            该Method已经失效，需重新进行配置
        </v-alert>
        <validation-provider
            v-slot="{ errors }"
            name="ParamSource"
            rules="required"
        >
            <g-label>参数来源</g-label>
            <v-radio-group
                label=""
                v-model="form.ParamSource"
                row
                :error-messages="errors"
            >
            <v-radio
                v-for="item in DubboMetaOrigin"
                :key="item"
                :label="item"
                :value="item"
            ></v-radio>
            </v-radio-group>
        </validation-provider>
        <g-simple-table :headers="form.Params.length ? paramHeaders : []" :list="form.Params" key="params">
            <template #item.serialNumber="{ index }">
                <span>{{ index + 1 }}</span>
            </template>
            <template #item.Value="{ item }">
                <span>{{ item.Value }}</span>
            </template>
            <template #item.Key="{ item }">
                <validation-provider
                    v-slot="{ errors }"
                    name="参数名"
                    rules="required"
                >
                    <v-text-field label="参数名*" v-model="item.Key" :error-messages="errors" required></v-text-field>
                </validation-provider>
            </template>
            <template #item.Required="{ item, index }">
                <v-switch v-model="item.Required" @change="handleRequired(index)"></v-switch>
            </template>
            <template #item.DefaultValue="{ item }">
                <v-text-field v-model="item.DefaultValue" :disabled="item.Required"></v-text-field>
            </template>
            <template #item.GenericInfo="{ item }">
                <v-text-field v-model="item.GenericInfo"></v-text-field>
            </template>
        </g-simple-table>
        <v-row>
            <v-col
                cols="12"
            >
                <g-label>
                    隐式参数传递
                    <g-note>隐式参数传递支持将HTTP请求参数映射到Dubbo Attachment中</g-note>
                </g-label>
            </v-col>
            <v-col
                cols="12"
                sm="12"
            >
            <g-simple-table :headers="attachmentHeaders" :list="form.Attachment" key="attachment">
                <template #item.ParamPosition="{ item }">
                    <validation-provider
                        v-slot="{ errors }"
                        name="参数来源"
                        rules="required"
                    >
                        <v-select
                            v-model="item.ParamPosition"
                            :items="paramPositionList"
                            label="参数来源*"
                            :error-messages="errors"
                            required
                        ></v-select>
                    </validation-provider>
                </template>
                <template #item.ClientParamName="{ item }">
                    <validation-provider
                        v-slot="{ errors }"
                        name="参数名"
                        rules="required"
                    >
                        <v-text-field label="参数名*" v-model="item.ClientParamName" :error-messages="errors" required></v-text-field>
                    </validation-provider>
                </template>
                <template #item.ServerParamName="{ item }">
                    <validation-provider
                        v-slot="{ errors }"
                        name="隐式参数名"
                        rules="required"
                    >
                        <v-text-field label="隐式参数名*" v-model="item.ServerParamName" :error-messages="errors" required></v-text-field>
                    </validation-provider>
                </template>
                <template #item.Description="{ item }">
                    <validation-provider
                        v-slot="{ errors }"
                        name="描述"
                    >
                        <v-text-field label="描述" v-model="item.Description" :error-messages="errors"></v-text-field>
                    </validation-provider>
                </template>
                <template #item.actions="{ index }">
                    <div>
                        <ActionBtnComp
                            color="error"
                            icon="mdi-delete"
                            tooltip="删除"
                            @click="removeOneItem(index)"
                        ></ActionBtnComp>
                    </div>
                </template>
            </g-simple-table>
            <v-btn block @click="addAttachmentItem">添加一个</v-btn>
            </v-col>
        </v-row>
    </template>
  </g-modal-form>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import ActionBtnComp from '@/components/ActionBtn';
import _ from 'lodash';
// Dubbo 转换
const TEMPLATE_MODEL = {
    ObjectType: 'route',
    ObjectId: '',
    Params: [],
    Method: '',
    CustomParamMapping: true,
    ParamSource: 'query',
    Attachment: [],
    MethodWorks: true,
    MethodParams: '',
};
export default {
    components: {
        ValidationProvider, ActionBtnComp,
    },
    props: {
        value: {
            type: Boolean,
            default: true,
        },
        current: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {
            paramPositionList: [
                { text: 'Cookie', value: 'Cookie' },
                { text: 'Header', value: 'Header' },
            ],
            paramHeaders: [
                { text: '序号', value: 'serialNumber' },
                { text: '类型', value: 'Value' },
                { text: '参数名', value: 'Key' },
                { text: '必填', value: 'Required', help: '客户端访问接口时必须携带参数，如果未携带参数网关直接报错' },
                { text: '默认值', value: 'DefaultValue', help: '客户端访问接口未携带参数时，网关使用该默认值调用Dubbo Method，如果未配置默认值，网关使用平台默认值调用Dubbo Method，平台默认值数值为0，对象为null，布尔为false' },
                { text: '泛型配置', value: 'GenericInfo' },
            ],
            attachmentHeaders: [
                { text: '参数来源', value: 'ParamPosition' },
                { text: '参数名', value: 'ClientParamName' },
                { text: '隐式参数名', value: 'ServerParamName', help: 'path,group,version,dubbo,token,timeout 为保留隐式参数名，请慎重使用' },
                { text: '描述', value: 'Description' },
                { text: '操作', value: 'actions' },
            ],
            serviceProxyInfo: null,
            visible: true,
            DubboMetas: [], // dubbo 数据
            form: JSON.parse(JSON.stringify(TEMPLATE_MODEL)),
            isMetaChanged: true,
            enabledSwitchFlag: false,
            DubboMetaOrigin: [ 'query', 'body' ],
        };
    },
    computed: {
        DubboMetaMethods() {
            return (this.DubboMetas || []).map(item => {
                return {
                    label: `${item.Method}(${item.RequestParams ? item.RequestParams.length : 0})`,
                    value: item.Method + (item.RequestParams || []),
                    params: item.RequestParams || [],
                    method: item.Method,
                };
            });
        },
        currentDubboMeta() {
            return (this.DubboMetas || []).find(item => {
                return (item.Method + (item.RequestParams || [])) === this.form.MethodParams;
            });
        },
    },
    methods: {
        addAttachmentItem() {
            this.form.Attachment.push({
                ClientParamName: '',
                Description: '',
                ParamPosition: '',
                ServerParamName: '',
            });
        },
        removeOneItem(index) {
            if (this.form.Attachment) {
                this.form.Attachment.splice(index, 1);
            }
        },
        loadServiceProxyInfo() {
            const { GwId, ServiceId } = this.current;
            if (!ServiceId) return;
            return this.axios({
                action: 'DescribeServiceProxyForPublishRoute',
                params: { ServiceId, GwId },
            }).then(({ EnvoyServiceProxy = {} }) => {
                this.serviceProxyInfo = EnvoyServiceProxy || {};
            });
        },
        handleMethodChange() { // 切换方法名
            this.isMetaChanged = true;
            this.updateDubboMetaData();
        },
        handleRequired(index) {
            if (this.form.Params[index] && this.form.Params[index].DefaultValue) {
                this.form.Params[index].DefaultValue = null;
            }
        },
        load() {
            const ObjectId = this.current.Id;
            return this.axios({
                action: 'DescribePublishedDubbo',
                params: { ObjectId, ObjectType: 'route' },
            }).then(({ Result } = {}) => {
                if (Result) {
                    this.enabledSwitchFlag = true;
                    this.form = _.pick(Result, Object.keys(TEMPLATE_MODEL));
                    if (!Result.Attachment) {
                        this.$set(this.form, 'Attachment', []);
                    }
                    const params = Result.Params.map(item => item.Value);
                    const MethodParams = Result.MethodWorks ? (Result.Method + params) : `${Result.Method}(${params.join()})`;
                    this.$set(this.form, 'MethodParams', MethodParams);
                } else {
                    this.enabledSwitchFlag = false;
                    this.form.ObjectId = ObjectId;
                    this.form.ParamSource = 'query';
                }
            });
        },
        reset() {
            this.enabledSwitchFlag = false;
            this.form = _.cloneDeep(TEMPLATE_MODEL);
        },
        closeModal() {
            this.reset();
            this.$emit('close');
        },
        submit() {
            if (!this.enabledSwitchFlag) {
                const ObjectId = this.form.ObjectId;
                // 直接下线
                const param = {
                    ObjectId,
                    ObjectType: 'route',
                };
                return this.axios({
                    action: 'OfflineDubbo',
                    params: param,
                }).then(() => {
                    this.closeModal();
                });
            }
            const param = _.cloneDeep(this.form);
            param.Params.forEach(item => {
                if (item.DefaultValue) {
                    const val = JSON.parse((item.DefaultValue + '').replace(/\r?\n|\r/g, '').replace(/ /g, ''));
                    item.DefaultValue = val;
                } else {
                    item.DefaultValue = null;
                }
            });
            const dubboMethod = this.DubboMetaMethods.find(item => this.form.MethodParams === item.value);
            param.Method = dubboMethod && dubboMethod.method;
            delete param.MethodParams;
            return this.axios({
                action: 'PublishDubbo',
                data: param,
            }).then(() => {
                this.$notify.success('Dubbo 转换配置成功');
                this.closeModal();
            });
        },
        loadDubboInfo() {
            const Igv = this.serviceProxyInfo.BackendService;
            const GwId = this.current.GwId;
            return this.axios({
                action: 'DescribeDubboMeta',
                params: { Igv, GwId },
            }).then(({ Result = [] }) => {
                this.DubboMetas = Result;
            });
        },
        updateDubboMetaData(isFirst) {
            this.form.Method = this.form.Method || this.DubboMetaMethods[0] || '';
            if (this.currentDubboMeta) {
                const RequestParams = this.currentDubboMeta.RequestParams || [];
                const oldRequestParams = this.form.Params || [];
                this.form.Params = RequestParams.map((item, index) => {
                    const oldValue = oldRequestParams[index];
                    return { Key: oldValue && oldValue.Key || '', Value: item, GenericInfo: oldValue && oldValue.GenericInfo,
                        Required: oldValue && oldValue.Required, DefaultValue: oldValue && oldValue.DefaultValue,
                    };
                });
            }
            if (isFirst) {
                this.isMetaChanged = this.form.MethodWorks;
            }
        },
    },
    async created() {
        await this.loadServiceProxyInfo();
        await this.loadDubboInfo();
        await this.load();
        this.updateDubboMetaData(true);
    },
};
</script>

<style module>

</style>
