<template>
    <v-select
        :items="items"
        v-bind="$attrs"
        v-on="$listeners"
    ></v-select>
</template>

<script>
export default {
    name: 'g-gateway-published-select',
    props: {
        ruleId: {
            type: [ Number, String ],
            required: true,
        },
    },
    data() {
        return {
            items: [],
        };
    },
    methods: {
        load() {
            const RuleId = this.ruleId;
            return this.axios({
                action: 'DescribeGatewayForPublishedRule',
                params: {
                    RuleId,
                    Limit: 1000,
                    Offset: 0,
                },
            }).then(({ GatewayInfos = [] }) => {
                this.items = GatewayInfos.map(item => {
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
