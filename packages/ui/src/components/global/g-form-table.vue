<template>
    <v-container>
        <v-row v-for="(item,index) in dataList" :key="index">
            <slot></slot>
        </v-row>
        <v-btn v-if="isAdd" block @click="handleAdd">添加</v-btn>
    </v-container>
</template>

<script>
export default {
    name: 'g-form-table',
    props: {
        value: Array,
        isAdd: Boolean,
        isDelet: Boolean,
        max: Number,
        min: Number,
        add: Function,
    },
    computed: {
        dataList() {
            return this.value;
        },
    },
    methods: {
        handleAdd() {
            Promise.resolve(this.add()).then(res => {
                console.log(res);
                res.forEach(item => {
                    item._formTableKey = Date.now();
                    this.dataList.push(item);
                });
            });
        },
    },
};
</script>

<style>
</style>
