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
    name: 'g-route-select',
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
                action: 'DescribeRouteList',
                params: {
                    Limit: 1000,
                    Offset: 0,
                },
            }).then(({ RouteList = [] }) => {
                this.items = RouteList.map(item => {
                    return {
                        ...item,
                        text: item.Name,
                        value: item.Id,
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
