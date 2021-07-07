<template>
    <div :class="$style.root" :border="border">
        <g-table-list
            :headers="headers"
            :load="getDataFromApi"
            hide-default-footer
        >
            <template #header>
                <div class="ml-4">{{ title }}</div>
            </template>
            <template v-slot:item.Type="{ item }">
                {{ item.Type | type }}
            </template>
            <template v-slot:item.Value="{ item }">
                <v-chip
                    class="mr-2"
                    x-small
                    color="primary"
                    label
                    v-for="value in item.Value"
                    :key="value"
                >
                    {{ value }}
                </v-chip>
            </template>
            <template v-slot:item.Key="{ item }">
                <v-chip v-if="item.Key"
                    class="mr-2"
                    x-small
                    color="secondary"
                    label
                >
                    {{ item.Key }}
                </v-chip>
            </template>
        </g-table-list>
    </div>
</template>
<script>
const TABLE_HEADERS = [
    { text: '匹配条件', value: 'Name' },
    { text: '匹配方式', value: 'custom', name: 'Type' },
    { text: '参数名', value: 'custom', name: 'Key' },
    { text: '条件取值', value: 'custom', name: 'Value' },
];
import { SUPPORT_TYPES, SUPOORT_MODAL_TYPES } from './types';
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
        title: {
            type: String,
            default: '路由信息',
        },
        border: Boolean,
    },
    filters: {
        type(v) {
            const one = SUPPORT_TYPES.find(item => item.value === v);
            return one && one.text || '-';
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
        list() {
            const data = this.data || {};
            return SUPOORT_MODAL_TYPES.reduce((arrs, typeItem) => {
                const key = typeItem.key;
                const Name = typeItem.text;
                const item = data[key];
                if (item) {
                    if (Array.isArray(item)) {
                        arrs.push(...item.map(subItem => {
                            return {
                                Name,
                                ...subItem,
                            };
                        }));
                    } else {
                        arrs.push({
                            Name,
                            ...item,
                        });
                    }
                }
                return arrs;
            }, []).filter(item => !!item);
        },
    },
    methods: {
        getDataFromApi() {
            const list = this.list;
            return Promise.resolve({
                list,
                total: list.length,
            });
        },
    },
    mounted() {
        console.info(this.list);
    },
};
</script>

<style module>
.root[border] {
    border: solid 1px #cccccc;
}
</style>
