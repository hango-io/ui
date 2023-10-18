<template>
    <v-container fluid>
        <v-breadcrumbs class="pl-3" v-if="$route.meta && $route.meta.breadcrumbs" large :items="$route.meta.breadcrumbs">
        </v-breadcrumbs>
        <v-card class="mx-auto mb-4" style="padding:20px">
            <validation-provider
                v-slot="{ errors }"
                name="插件名称"
                rules="required">
                <v-text-field
                    v-model="form.PluginType"
                    label="插件名称*"
                    :error-messages="errors"
                    required
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="中文名称">
                <v-text-field
                    v-model="form.PluginName"
                    label="中文名称"
                    :error-messages="errors"
                    required
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="插件描述"
                rules="required">
                <v-text-field
                    v-model="form.Description"
                    label="插件描述*"
                    :error-messages="errors"
                    required
                ></v-text-field>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="类型"
                rules="required">
                <v-select
                    label="类型*"
                    v-model="form.PluginCategory"
                    :items="PLUGIN_TYPES"
                    required
                ></v-select>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="实现语言"
                rules="required">
                <v-select
                    label="实现语言*"
                    v-model="form.Language"
                    :items="['lua']"
                    required
                ></v-select>
            </validation-provider>
            <validation-provider
                v-slot="{ errors }"
                name="作用域"
                rules="required">
                <v-select
                    v-model="form.PluginScope"
                    label="作用域*"
                    :items="[{text: '路由', value: 'routeRule'}]"
                    attach
                    chips
                    multiple
                    required
                ></v-select>
            </validation-provider>
             <validation-provider
                v-slot="{ errors }"
                name="代码文件"
                rules="required">
                <v-radio-group row v-model="form.SourceType">
                    <v-radio
                        label="本地文件"
                        value="file"
                    ></v-radio>
                    <v-radio
                        label="镜像文件"
                        value="oci"
                    ></v-radio>
                </v-radio-group>
            </validation-provider>
            <validation-provider>
                <v-flex v-if="form.SourceType === 'file'">
                    <v-btn @click="upload">脚本文件上传</v-btn>
                    <input type="file" id="upload" ref="upload" @change="changeFile" accept=".lua">
                    <span style="margin-left:20px">{{fileName}}</span>
                    <v-icon
                        v-if="Id"
                        color="secondary"
                        @click="downLoad">
                        mdi-arrow-down-bold-box-outline
                    </v-icon>
                </v-flex>
                <template v-else>
                    <v-text-field
                        v-model="form.SourceUrl"
                        label="镜像OCI地址*"
                        :error-messages="errors"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="form.SecretName"
                        label="secret名称"
                        :error-messages="errors"
                    ></v-text-field>
                </template>
            </validation-provider>
        </v-card>
        <v-card class="mx-auto mb-4" style="padding:20px; height: 750px">
            <v-row no-gutters>
                <v-col>
                    <v-sheet class="pa-2 ma-2" style="height:100%">
                        <div>
                            <codemirror id="schema" ref="schema" v-model="schemaContent" :options="cmOptions"></codemirror>
                        </div>
                        <v-card style="margin-top:12px">
                            <v-card-title>Result</v-card-title>
                            <codemirror id="result" ref="schemaResultValue" v-model="resultValue" :options="cmOptions"></codemirror>
                        </v-card>
                    </v-sheet>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col>
                    <v-sheet class="pa-2 ma-2" v-if="isRefresh">
                        <ss-form-schema ref="ssformSchemaRef" :schema="schema"></ss-form-schema>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-card>
        <v-row justify="end">
            <v-col cols="6">
                <v-btn
                    block
                    @click="validate()"
                >插件验证</v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn
                    block
                    color="primary"
                    @click="handleClick()"
                >确定</v-btn>
            </v-col>
        </v-row>
        <v-alert
            v-if="errMsg"
            color="red"
            text
            type="error"
            transition="scale-transition"
        >{{errMsg}}</v-alert>
</v-container>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
import { PLUGIN_TYPES } from './config.js';
import { codemirror } from 'vue-codemirror'; // 引入组件
import 'codemirror/lib/codemirror.css';
import SCHEMA_MODEL from './schema.json';
import service from '@/service/plugin.js';
export default {
    components: {
        ValidationProvider, codemirror,
    },
    data() {
        return {
            PLUGIN_TYPES,
            form: {
                PluginType: '',
                PluginName: '',
                Description: '',
                PluginCategory: 'security',
                Language: 'lua',
                PluginScope: [ 'routeRule' ],
                SourceContent: '',
                SourceUrl: '',
                SecretName: '',
                SourceType: 'file', // file、oci
                SchemaContent: '',
            },
            cmOptions: {
                value: '', // 编辑器的起始值。可以是字符串，也可以是文档对象。
                mode: 'application/json', // 第一个将模式名称映射到它们的构造函数，第二个将MIME类型映射到模式规范。
                theme: 'liquibyte', // 编辑器样式的主题
                indentWithTabs: true, // 在缩进时，是否tabSize 应该用N个制表符替换前N *个空格。默认值为false。
                smartIndent: true, // 是否使用模式提供的上下文相关缩进（或者只是缩进与之前的行相同）。默认为true。
                lineNumbers: true, // 是否在编辑器左侧显示行号。
                matchBrackets: true, // 括号匹配
                autofocus: true, // 可用于使CodeMirror将焦点集中在初始化上
                extraKeys: { 'Ctrl-Space': 'autocomplete' }, // 按键配置
                hintOptions: {
                    tables: {
                        users: [ 'name', 'score', 'birthDate' ],
                        countries: [ 'name', 'population', 'size' ],
                    },
                },
                gutters: [
                    'CodeMirror-linenumbers',
                    'CodeMirror-foldgutter',
                    'CodeMirror-lint-markers', // CodeMirror-lint-markers是实现语法报错功能
                ],
            },
            schemaContent: JSON.stringify(SCHEMA_MODEL, false, 4),
            isRefresh: true,
            resultValue: '',
            fileName: '',
            file: [],
            errMsg: '',
        };
    },
    computed: {
        schema() {
            return JSON.parse(this.schemaContent);
        },
        Id() {
            return this.$route.query.Id || '';
        },
        PluginImport() {
            return 'proxy/api/gportal/v1/plugin?Action=PluginImport&Version=';
        },
        PluginUpdate() {
            return 'proxy/api/gportal/v1/plugin?Action=PluginUpdate&Version=';
        },
    },
    watch: {
        schemaContent: {
            handler(nv, ov) {
                if (nv !== ov) {
                    this.isRefresh = false;
                    this.$nextTick(() => {
                        this.isRefresh = true;
                    });
                }
            },
        },
    },
    methods: {
        initInfo() {
            return this.axios({
                action: 'DescribeCustomPluginInfo',
                params: {
                    Id: this.Id,
                },
            }).then(({ Result = {} }) => {
                this.form = Result;
                this.schemaContent = Result.SchemaContent || '';
                this.fileName = `${this.form.PluginType}.lua`;
                this.form.SourceContent = new Blob([ Result.SourceContent ]);
            });
        },
        upload() {
            const uploadbtn = this.$refs.upload;
            uploadbtn.click();
        },
        changeFile(e) {
            this.form.SourceContent = e.target.files[0];
            this.fileName = e.target.files[0].name;
        },
        handleClick() {
            this.form.SchemaContent = this.schemaContent;
            console.log(this.form.PluginScope);
            Object.keys(this.form).forEach(key => {
                if (!this.form[key]) {
                    delete this.form[key];
                }
            });
            const formData = this.formatterData({ ...this.form, Id: this.Id, Author: 'admin' });
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.Id ? this.PluginUpdate : this.PluginImport);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.$router.push({ name: 'hango.pluginMarket' });
                    } else {
                        try {
                            const obj = JSON.parse(xhr.responseText);
                            this.errMsg = obj.Message;
                            setTimeout(() => {
                                this.errMsg = '';
                            }, 3000);
                        } catch (error) {
                            // error
                        }
                    }
                }
            };
            this.injectHeaders(xhr);
            xhr.send(formData);
        },
        formatterData(data) {
            const formData = new FormData();
            for (const i in data) {
                formData.append(i, data[i]);
            }
            return formData;
        },
        injectHeaders(xhr) {
            xhr.setRequestHeader('x-auth-accountId', 'admin');
            xhr.setRequestHeader('x-auth-tenantId', 1);
            xhr.setRequestHeader('x-auth-projectId', 1);
            xhr.setRequestHeader('X-163-AcceptLanguage', 'zh');
            return xhr;
        },
        validate() {
            if (!this.$refs.ssformSchemaRef) return;
            const result = this.$refs.ssformSchemaRef.getValue();
            const resultValue = JSON.stringify(result || {}, false, 4);
            console.log(resultValue);
            this.resultValue = resultValue;
        },
        downLoad() {
            const blob = new Blob([ this.form.SourceContent ], { type: 'text/plain' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${this.form.PluginType}.lua`;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        },
    },
    mounted() {
        this.$route.query.Id && this.initInfo();
    },
};
</script>
<style>
#upload{
    height:0;
    width: 0;
    visibility: hidden;
}
#result .CodeMirror {
    height: 200px;
}
#schema .CodeMirror {
    height: 400px;
}
</style>
