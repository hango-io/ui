<template>
    <g-modal-form
        :title="isEdit ? '修改路由' : '创建路由'"
        :okText="isEdit ? '保存' : '创建'"
        visible
        :submit="handleSubmit"
        @close="handleClose"
        maxWidth="900px"
    >
        <validation-provider
            v-slot="{ errors }"
            name="所属服务"
            rules="required"
        >
            <g-service-select
                v-model="form.ServiceId"
                label="所属服务*"
                :error-messages="errors"
                required
            ></g-service-select>
        </validation-provider>
        <validation-provider
            v-slot="{ errors }"
            name="路由名称"
            rules="required"
        >
            <v-text-field
                v-model="form.RouteRuleName"
                label="路由名称*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>

        <g-label>Path</g-label>
        <v-row>
            <v-col
                cols="12"
                sm="6"
            >
                <validation-provider
                    v-slot="{ errors }"
                    name="匹配方式"
                    rules="required"
                >
                    <v-select
                        v-model="form.Uri.Type"
                        :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('Path') : true)"
                        label="匹配方式"
                        :error-messages="errors"
                        required
                    ></v-select>
                </validation-provider>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
                <g-multi-validation-text-field
                    label="条件取值"
                    rules="Required"
                    v-model="form.Uri.Value">
                </g-multi-validation-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col
                v-for="item in SUPOORT_MODAL_TYPES.filter(item => item.key !== 'Uri')"
                :key="item.key"
                cols="3"
            >
            <v-checkbox
                v-model="typeSelected"
                :label="item.text"
                :value="item.key"
                @change="handleTypeSelectChange"
            ></v-checkbox>
            </v-col>
        </v-row>

        <v-row v-if="typeSelected.includes('Host')">
            <v-col
                cols="12"
            >
                <g-label>Host</g-label>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
                <validation-provider
                    v-slot="{ errors }"
                    name="匹配方式"
                    rules="required"
                >
                    <v-select
                        v-model="form.Host.Type"
                        :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('Host') : true)"
                        label="匹配方式"
                        :error-messages="errors"
                        required
                    ></v-select>
                </validation-provider>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
                <g-multi-validation-text-field
                    label="条件取值"
                    rules="Required"
                    v-model="form.Host.Value">
                </g-multi-validation-text-field>
            </v-col>
        </v-row>

        <v-row v-if="typeSelected.includes('Method')">
            <v-col cols="12">
                <g-label>Method</g-label>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
                <validation-provider
                    v-slot="{ errors }"
                    name="匹配方式"
                    rules="required"
                >
                    <v-select
                        v-model="form.Method.Type"
                        :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('Method') : true)"
                        label="匹配方式"
                        :error-messages="errors"
                        required
                    ></v-select>
                </validation-provider>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
                <v-autocomplete
                    v-model="form.Method.Value"
                    :items="SUPPORT_METHOD_KEYS"
                    chips
                    small-chips
                    label="条件取值"
                    multiple
                ></v-autocomplete>
                <!-- <g-multi-validation-text-field
                    label="条件取值"
                    v-model="form.Method.Value">
                </g-multi-validation-text-field> -->
            </v-col>
        </v-row>
<!-- Header -->
        <v-row v-if="typeSelected.includes('Headers')">
            <v-col
                cols="12"
            >
                <g-label>Header</g-label>
            </v-col>
            <v-col
                cols="12"
            >
                <g-simple-table :headers="supoortModal" :list="form.Headers">
                    <template #item.Key="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="参数名"
                            rules="required"
                        >
                            <v-text-field
                                v-model="item.Key"
                                label="参数名*"
                                :error-messages="errors"
                                required
                            ></v-text-field>
                        </validation-provider>
                    </template>
                    <template #item.Type="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="匹配方式"
                            rules="required"
                        >
                            <v-select
                                v-model="item.Type"
                                :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('Headers') : true)"
                                label="匹配方式"
                                :error-messages="errors"
                                required
                            ></v-select>
                        </validation-provider>
                    </template>
                    <template #item.Value="{ item }">
                        <g-multi-validation-text-field
                            style="margin-bottom: 10px;"
                            label="条件取值"
                            rules="Required"
                            v-model="item.Value">
                        </g-multi-validation-text-field>
                    </template>
                    <template #item.actions="{ index }">
                        <div>
                            <ActionBtnComp
                                color="error"
                                icon="mdi-delete"
                                tooltip="删除"
                                @click="removeOneItem('Headers', index)"
                            ></ActionBtnComp>
                        </div>
                    </template>
                </g-simple-table>
                <v-btn block @click="() => addOneItem('Headers')">添加一个</v-btn>
            </v-col>
        </v-row>

<!-- Query -->
        <v-row v-if="typeSelected.includes('QueryParams')">
            <v-col
                cols="12"
            >
                <g-label>Query</g-label>
            </v-col>
            <v-col
                cols="12"
            >
                <g-simple-table :headers="supoortModal" :list="form.QueryParams">
                    <template #item.Key="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="参数名"
                            rules="required"
                        >
                            <v-text-field
                                v-model="item.Key"
                                label="参数名*"
                                :error-messages="errors"
                                required
                            ></v-text-field>
                        </validation-provider>
                    </template>
                    <template #item.Type="{ item }">
                        <validation-provider
                            v-slot="{ errors }"
                            name="匹配方式"
                            rules="required"
                        >
                            <v-select
                                v-model="item.Type"
                                :items="SUPPORT_TYPES.filter(item => item.bans ? !item.bans.includes('QueryParams') : true)"
                                label="匹配方式"
                                :error-messages="errors"
                                required
                            ></v-select>
                        </validation-provider>
                    </template>
                    <template #item.Value="{ item }">
                        <g-multi-validation-text-field
                            style="margin-bottom: 10px;"
                            label="条件取值"
                            rules="Required"
                            v-model="item.Value">
                        </g-multi-validation-text-field>
                    </template>
                    <template #item.actions="{ index }">
                        <div>
                            <ActionBtnComp
                                color="error"
                                icon="mdi-delete"
                                tooltip="删除"
                                @click="removeOneItem('QueryParams', index)"
                            ></ActionBtnComp>
                        </div>
                    </template>
                </g-simple-table>
                <v-btn block @click="() => addOneItem('QueryParams')">添加一个</v-btn>
            </v-col>
        </v-row>

        <validation-provider
            v-slot="{ errors }"
            name="优先级"
            rules="required"
        >
            <v-text-field
                v-model.number="form.Priority"
                label="优先级*"
                :error-messages="errors"
                required
            ></v-text-field>
        </validation-provider>
        <validation-provider
            v-slot="{ errors }"
            name="备注信息"
        >
            <v-textarea
                v-model="form.Description"
                label="备注信息"
                :error-messages="errors"
            ></v-textarea>
        </validation-provider>

    </g-modal-form>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
import ActionBtnComp from '@/components/ActionBtn';
import { SUPPORT_TYPES, SUPOORT_MODAL_TYPES, SUPPORT_METHOD_KEYS } from './types';
export default {
    components: {
        ValidationProvider, ActionBtnComp,
    },
    props: {
        current: Object,
        type: {
            type: String,
            default: 'add',
        },
    },
    data: () => ({
        typeSelected: [],
        form: {
            ServiceId: '',
            RouteRuleName: '',
            Priority: '50',
            Description: '',
            Uri: {
                Type: 'exact',
                Value: [ '' ],
            },
            // Host: {
            //     Type: 'exact',
            //     Value: [ '' ],
            // },
            // Method: {
            //     Type: 'exact',
            //     Value: [ '' ],
            // },
            // Headers: [],
            // QueryParams: [],
        },
    }),
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
        supoortModal() {
            return [
                { text: '参数名', value: 'Key' },
                { text: '匹配方式', value: 'Type' },
                { text: '条件取值', value: 'Value', type: 'array' },
                { text: '操作', value: 'actions', notKey: true },
            ];
        },
        SUPOORT_MODAL_TYPES() {
            return JSON.parse(JSON.stringify(SUPOORT_MODAL_TYPES)).filter(item => item.key !== 'Uri');
        },
        SUPPORT_METHOD_KEYS() {
            return JSON.parse(JSON.stringify(SUPPORT_METHOD_KEYS));
        },
        SUPPORT_TYPES() {
            return JSON.parse(JSON.stringify(SUPPORT_TYPES));
        },
    },
    methods: {
        addOneItem(type) {
            if (this.form[type]) {
                const SUPOORT_MODAL_TYPES = this.SUPOORT_MODAL_TYPES || [];
                const one = SUPOORT_MODAL_TYPES.find(item => item.key === type);
                one && this.form[type].push(JSON.parse(JSON.stringify(one.model)));
            }
        },
        removeOneItem(type, index) {
            if (this.form[type]) {
                this.form[type].splice(index, 1);
            }
        },
        handleTypeSelectChange(v) {
            const SUPOORT_MODAL_TYPES = this.SUPOORT_MODAL_TYPES || [];
            SUPOORT_MODAL_TYPES.forEach(item => {
                const key = item.key;
                if (v.includes(key)) {
                    if (!this.form[key]) {
                        if (item.type === 'object') {
                            this.$set(this.form, key, JSON.parse(JSON.stringify(item.model)));
                        } else {
                            this.$set(this.form, key, [ JSON.parse(JSON.stringify(item.model)) ]);
                        }
                    }
                } else {
                    this.$delete(this.form, key);
                }
            });
        },
        handleSubmit() {
            return this.axios({
                action: this.isEdit ? 'UpdateRouteRule' : 'CreateRouteRule',
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
            const SUPOORT_MODAL_TYPES = this.SUPOORT_MODAL_TYPES || [];
            SUPOORT_MODAL_TYPES.forEach(item => {
                const key = item.key;
                if (this.form[key]) {
                    this.typeSelected.push(key);
                }
            });
        }
    },
};
</script>

