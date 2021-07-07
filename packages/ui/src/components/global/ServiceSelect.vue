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
    methods: {
        load() {
            return this.axios({
                action: 'DescribeServiceList',
                params: {
                    Limit: 1000,
                    Offset: 0,
                },
            }).then(({ ServiceInfoList = [] }) => {
                this.items = ServiceInfoList.map(item => {
                    return {
                        ...item,
                        text: item.ServiceName,
                        value: item.ServiceId,
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
