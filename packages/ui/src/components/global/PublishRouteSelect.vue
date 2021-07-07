<template>
    <v-select
        :items="items"
        v-bind="$attrs"
        @change="handleChange"
        @input="handleInput"
        v-on="$$listeners"
    ></v-select>
</template>

<script>
export default {
    name: 'g-publish-route-select',
    data() {
        return {
            items: [],
        };
    },
    computed: {
        $$listeners() {
            const $listeners = this.$listeners;
            if ($listeners) {
                delete $listeners.input;
                delete $listeners.change;
            }
            return $listeners;
        },
    },
    methods: {
        load() {
            return this.axios({
                action: 'DescribePublishRouteRuleList',
                params: {
                    Limit: 1000,
                    Offset: 0,
                },
            }).then(({ RouteRuleProxyList = [] }) => {
                this.items = RouteRuleProxyList.map(item => {
                    return {
                        ...item,
                        text: item.RouteRuleName,
                        value: item.RouteRuleId,
                    };
                });
            });
        },
        handleChange(id) {
            const one = this.items.find(item => item.value === id);
            this.$emit('change', id, one);
        },
        handleInput(id) {
            const one = this.items.find(item => item.value === id);
            this.$emit('input', id, one);
        },
    },
    created() {
        this.load();
    },
};
</script>
