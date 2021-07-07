<template>
    <div :class="$style.root">
      <v-data-table
        :headers="headers"
        :items="list"
        :server-items-length="total"
        :loading="loading"
        :options.sync="options"
        :footer-props="{
            'items-per-page-options': [ 20, 50, 100 ],
        }"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template #top>
            <div class="mt-4 mb-2">
                <slot name="header">
                    <ActionBtnComp
                        icon="mdi-refresh"
                        tooltip="刷新"
                        @click="refresh()"
                    ></ActionBtnComp>
                    <slot name="top"></slot>
                </slot>
            </div>
        </template>
        <template #item.CreateTime="{ item }">
            <span>{{ item.CreateTime | smartTimestamp }}</span>
        </template>
        <template #item.UpdateTime="{ item }">
            <span>{{ item.UpdateTime | smartTimestamp }}</span>
        </template>
        <template #item.CreateDate="{ item }">
            <span>{{ item.CreateDate | smartTimestamp }}</span>
        </template>
        <template #item.ModifyDate="{ item }">
            <span>{{ item.ModifyDate | smartTimestamp }}</span>
        </template>
        <template #item.custom="{ item, header }">
            <slot v-if="header && header.name" :name="`item.${header.name}`" :item="item"></slot>
            <slot v-else name="item" :item="item"></slot>
        </template>
        <template #expanded-item="{ item, headers }">
            <slot name="expanded-item" :item="item" :headers="headers"></slot>
        </template>
      </v-data-table>
    </div>
</template>
<script>
const TEMPLATE_MODEL = {
    options: {
        page: 1, itemsPerPage: 20,
    },
    list: [],
    total: 0,
    loading: false,
};
import ActionBtnComp from '@/components/ActionBtn';
export default {
    name: 'g-table-list',
    components: { ActionBtnComp },
    props: {
        load: {
            type: Function,
            required: true,
        },
        headers: Array,
        notFirstLoad: Boolean,
    },
    data() {
        return JSON.parse(JSON.stringify(TEMPLATE_MODEL));
    },
    methods: {
        refresh() {
            this.loadList();
        },
        reload() {
            this.options.page = 1;
            this.loadList();
        },
        loadList() {
            const { sortBy, sortDesc, page, itemsPerPage } = this.options;
            const Limit = itemsPerPage;
            const Offset = (page - 1) * Limit;
            const params = {
                Limit, Offset,
            };
            this.loading = true;
            this.list = [];
            return this.load(params).then(res => {
                this.list = res.list || res.List || res.Result || [];
                this.total = res.total || res.Total || res.TotalCount || 0;
                this.loading = false;
            }).catch(err => {
                this.list = [];
                this.total = 0;
                this.loading = false;
                if (err) {
                    this.$notify.error(err.Message || err.message || '获取失败!');
                }
            });
        },
    },
    created() {
        if (!this.notFirstLoad) {
            this.refresh();
        }
    },
};
</script>

<style module>
.root {
    position: relative;
}
</style>
