<template>
    <v-select
        :items="items"
        v-bind="$attrs"
        v-on="$listeners"
    ></v-select>
</template>

<script>
export default {
    name: 'g-service-select',
    data() {
        return {
            items: [],
        };
    },
    props: {
        VirtualGwId: {
            type: [ String, Number ],
            default: '',
        },
    },
    watch: {
        VirtualGwId(nV, oV) {
            if (nV && nV !== oV) {
                this.load();
            }
        },
    },
    methods: {
        load() {
            return this.axios({
                action: 'DescribeServiceList',
                params: {
                    Limit: 1000,
                    Offset: 0,
                    VirtualGwId: this.VirtualGwId,
                },
            }).then(({ Result = [] }) => {
                this.items = Result.map(item => {
                    return {
                        ...item,
                        text: item.Name,
                        value: item.Id,
                    };
                });
            });
        },
    },
    created() {
        if (this.VirtualGwId !== '') {
            this.load();
        }
    },
};
</script>
