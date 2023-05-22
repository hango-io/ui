<template>
    <v-container>
        <v-row v-for="(item,index) in dataList" :key="item._formTableKey">
            <slot :row="item" :index="index"></slot>
            <v-col cols="12" md="3" v-if="isDelet">
                <div style="height:100%;display: flex;align-items: center;">
                    <ActionBtnComp color="error" tooltip="删除" icon="mdi-delete" @click="handleDelete(item, index)"></ActionBtnComp>
                </div>
            </v-col>
        </v-row>
        <v-btn v-if="isAdd" block @click="handleAdd">添加</v-btn>
    </v-container>
</template>

<script>
import ActionBtnComp from '@/components/ActionBtn';
import _ from 'lodash';
export default {
    components: { ActionBtnComp },
    name: 'g-form-table',
    props: {
        data: Array,
        isAdd: Boolean,
        isDelet: Boolean,
        max: Number,
        min: Number,
        add: Function,
    },
    data() {
        return {
            dataList: this.data.map(item => {
                item._formTableKey = Date.now();
                return item;
            }),
        };
    },
    methods: {
        handleAdd() {
            Promise.resolve(this.add()).then(res => {
                res._formTableKey = Date.now();
                this.dataList.push(res);
            });
            this.$emit('update:data', this.dataList);
        },
        handleDelete(item, index) {
            if (this.$listeners.hasOwnProperty('beforeDelet')) {
                this.$emit('beforeDelet', {
                    item,
                    index,
                    data: this.dataList,
                    okCallBack: () => {
                        // ok
                        this.dataList.splice(index, 1);
                    },
                    cancelCallBack: () => {},
                });
            } else {
                this.dataList.splice(index, 1);
            }
            if (this.$listeners.hasOwnProperty('afterDelet')) {
                this.$emit('afterDelet', {
                    item,
                    index,
                    data: this.dataList,
                });
            }
        },
    },
};
</script>

<style>
</style>
