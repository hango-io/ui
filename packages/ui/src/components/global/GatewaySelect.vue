<template>
    <v-select :items="items" v-bind="$attrs" v-on="$listeners" @change="innerChangeHandler"></v-select>
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
                action: 'DescribeVirtualGatewayList',
                data: {
                    ProjectIdList: [ 1 ], // 固定写1
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
        innerChangeHandler(value) {
            const tragetGw = this.items.find(gw => gw.value === value);
            this.$emit('gatewayChange', tragetGw);
        },
    },
    created() {
        this.load();
    },
};
</script>
