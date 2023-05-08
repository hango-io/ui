<template>
    <v-data-table
        :headers="headers"
        :items="_list"
        hide-default-footer
    >
        <template #item.ParamName="{ item }">
            <v-chip color="indigo" text-color="white" label x-small> {{ item.ParamName }}</v-chip>
        </template>
        <template #item.ParamMethod="{ item }">
         {{ item.ParamMethod |supportTypes }}
        </template>
        <template #item.ParamValue="{ item }">
            <span v-if="item.ParamValue && item.ParamValue.length !== 0 ">
                <span v-if="item.ParamName === 'Method'">
                    <v-chip color="info" text-color="white" label x-small v-for="(value, index) in item.ParamValue" :key="index">  {{ value }}</v-chip>
                </span>
                <span v-else>
                    <v-chip label x-small v-for="(value, index) in item.ParamValue" :key="index">  {{ value }}</v-chip>
                </span>
            </span>
            <span v-else> - </span>
        </template>
    </v-data-table>
</template>

<script>
import { SUPPORT_TYPES_MAP, SUPPORT_VALUES } from './types.js';
const TABLE_HEADERS = [
    { text: '匹配条件', value: 'ParamName', name: 'ParamName' },
    { text: '参数名', value: 'ParamKey' },
    { text: '匹配方式', value: 'ParamMethod', name: 'ParamMethod' },
    { text: '条件取值', value: 'ParamValue', name: 'ParamValue' },
];
export default {
    name: 'rule-list',
    props: {
        list: {
            type: Array,
            default() {
                return [];
            },
        },
        info: Object,
    },
    filters: {
        supportTypes(key) {
            return (
                (SUPPORT_TYPES_MAP[key] && SUPPORT_TYPES_MAP[key].text) || '-'
            );
        },
    },
    data() {
        return {
            headers: TABLE_HEADERS.map(item => {
                return {
                    ...item,
                    align: 'start',
                    sortable: false,
                };
            }),
        };
    },
    computed: {
        _list() {
            if (this.info) {
                return this.createRuleList(this.info);
            }
            return this.list;
        },
        hasParamKey() {
            return this._list.some(item => !!item.ParamKey);
        },
    },
    methods: {
        createRuleList(info) {
            const result = [];
            SUPPORT_VALUES.forEach(item => {
                const itemInfo = info[item.key];
                if (item.key === 'Method') {
                    result.push({
                        ParamName: 'Method',
                        ParamKey: '',
                        ParamMethod: '',
                        ParamValue: itemInfo,
                    });
                } else if (Array.isArray(itemInfo)) {
                    itemInfo.forEach(_item => {
                        result.push({
                            ParamName: item.text,
                            ParamKey: _item.Key,
                            ParamMethod: _item.Type,
                            ParamValue: _item.Value,
                        });
                    });
                } else if (itemInfo) {
                    result.push({
                        ParamName: item.text,
                        ParamKey: itemInfo.Key,
                        ParamMethod: itemInfo.Type,
                        ParamValue: itemInfo.Value,
                    });
                }
            });
            return result;
        },
    },
};
</script>

<style module>
.label {
    height: 35px;
    border-bottom: 1px solid #dfe4ec;
    font-weight: 700;
    margin-bottom: 20px;
}
</style>
