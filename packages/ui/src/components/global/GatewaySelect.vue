<template>
    <v-select
        :items="items"
        v-bind="$attrs"
        v-on="$listeners"
    ></v-select>
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
                action: 'DescribeGatewayListForGatewayTab',
                params: {
                    Limit: 1000,
                    Offset: 0,
                },
            }).then(({ GatewayInfos = [] }) => {
                this.items = GatewayInfos.map(item => {
                    return {
                        ...item,
                        text: item.GwName,
                        value: item.GwId,
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
