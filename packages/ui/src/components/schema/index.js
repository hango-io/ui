import Vue from 'vue';

import { FormSchema } from '@ssform/core';
import ItemComp from './item';
import GroupComp from './group';
import ArrayComp from './array';
const options = {
    name: 'ss-form-schema',
    props: {
        schema: {
            type: Object,
            required: true,
        },
        value: Object,
    },
    data() {
        return {
            schemaForm: null,
        };
    },
    methods: {
        render(_h, l, c) {
            if (l.isRoot) {
                return _h('form', {
                    key: l.uuid,
                    // on: this.$listeners,
                    // props: this.$attrs,
                }, c);
            } else if (l.isGroup) {
                let item = c;
                if (l.isDynamicLayoutType) {
                    item = c.length > 0 ? c.map((itemC, index) => {
                        const layout = [ ...l.layouts ][index];
                        return _h(ArrayComp, {
                            key: layout.uuid,
                            props: {
                                layout,
                            },
                        }, [ itemC ]);
                    }) : [];
                }
                return _h(GroupComp, {
                    key: l.uuid,
                    props: {
                        layout: l,
                        hiddenHeader: l.parent.isDynamicLayoutType,
                    },
                }, item);
            }
            return _h(ItemComp, {
                key: l.uuid,
                props: {
                    layout: l,
                },
            }, c);
        },
        getValue() {
            return this.schemaForm && this.schemaForm.formatValue || null;
        },
    },
    created() {
        this.schemaForm = new FormSchema({
            ...this.schema,
        }, this.value, {
            render: this.render,
            update: () => {
                this.$forceUpdate();
            },
        }).create();
    },
    render(h) {
        return this.schemaForm.render(h);
    },
};

Vue.component(options.name, options);
