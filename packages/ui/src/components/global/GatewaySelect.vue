<template>
    <v-select :items="items" v-bind="$attrs" v-on="$listeners"></v-select>
</template>

<script>
export default {
    name: 'g-gateway-select',
    data() {
        return {
            items: [],
        };
    },
    methods: {
        load() {
            return this.axios({
                action: 'DescribeVirtualGateway',
                data: {
                    ProjectIdList: [ '3' ], // 固定写1
                },
            }).then(({ Result = [] }) => {
                this.items = Result.map(item => {
                    return {
                        ...item,
                        text: item.Name,
                        value: item.VirtualGwId,
                    };
                });
            });
        },
    },
    created() {
        this.load();
    },
};
</script>
