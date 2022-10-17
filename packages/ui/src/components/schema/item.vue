<template>
    <validation-provider :name="layoutLabel" :level="layout.level" :key="layout.key" v-slot="{ errors }" :rules="layoutRulesObj">
        <!-- {{ layoutRules }} -->
        <template v-if="layoutType === 'input'">
            <v-text-field :label="layoutLabel" :error-messages="errors" v-model="layout.data"></v-text-field>
        </template>
        <template v-else-if="layoutType === 'number'">
            <v-text-field :label="layoutLabel" :error-messages="errors" type="number" v-model.number="layout.data"></v-text-field>
        </template>
        <template v-else-if="layoutType === 'checkbox'">
            <span>{{ layoutLabel }}</span>
            <div :class="$style.checkboxes">
                <v-checkbox
                    v-for="optionItem in layoutOptions"
                    :key="optionItem.value"
                    :label="optionItem.text"
                    :value="optionItem.value"
                    :disabled="optionItem.disabled"
                    :error-messages="errors"
                    v-model="selectedDatas"
                ></v-checkbox>
            </div>
        </template>
        <template v-else-if="layoutType === 'switch'">
            <!-- <span>{{ layoutLabel }}</span> -->
            <v-switch v-model="layout.data" :error-messages="errors" :label="layoutLabel"></v-switch>
        </template>
        <template v-else-if="layoutType === 'select'">
            <v-select v-model="layout.data" :items="layoutOptions" :label="layoutLabel" :error-messages="errors" :hint="layout.description"></v-select>
        </template>
        <template v-else-if="layoutType === 'multi_select'">
            <v-select
                v-model="layout.data"
                :items="layoutOptions"
                multiple
                chips
                :label="layoutLabel"
                :error-messages="errors"
                :hint="layout.description"
            ></v-select>
        </template>
        <template v-else-if="layoutType === 'multi_input'">
            <span>{{ layoutLabel }}</span>
            <g-multi-validation-text-field
                :min="0"
                v-model="layout.data"
                :label="layoutLabel"
                :error-messages="errors"
                :rules="layoutRulesObj"
            ></g-multi-validation-text-field>
        </template>
        <span style="color: red;" v-else>{{ layoutLabel }} [ {{ schema.type }} ]</span>
    </validation-provider>
</template>

<script>
import _ from 'lodash';
import { ValidationProvider } from 'vee-validate';
export default {
    name: 'ss-form-schema-item',
    components: {
        ValidationProvider,
    },
    props: {
        layout: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            selectedDatas: this.layout.data,
        };
    },
    watch: {
        selectedDatas: {
            handler(nV) {
                this.layout.data = nV;
            },
            immediate: true,
        },
    },
    computed: {
        isEdit() {
            return this.type === 'edit';
        },
        isView() {
            return this.type === 'view';
        },
        schema() {
            const layout = this.layout || {};
            return layout.schema;
        },
        layoutLabel() {
            if (this.layoutRules.includes('Required')) {
                return `${this.schema.alias}*`;
            }
            return this.schema.alias;
        },
        layoutRulesObj() {
            const rules = this.layoutRules || [];
            return rules.reduce((obj, rule) => {
                if (typeof rule === 'string') {
                    obj[rule] = true;
                } else if (typeof rule === 'object') {
                    Object.assign(obj, rule);
                }
                return obj;
            }, {});
        },
        layoutRules() {
            const rules = this.schema.rules || [];
            const newRules = rules.map(rule => {
                if (typeof rule === 'string') {
                    // 兼容性处理
                    if (/MaxNumber\(\d+\)/.test(rule)) {
                        return { MaxNumber: rule.replace('MaxNumber(', '').replace(')', '') };
                    } else if (/MinNumber\(\d+\)/.test(rule)) {
                        return { MinNumber: rule.replace('MinNumber(', '').replace(')', '') };
                    } else if (/MaxLength\(\d+\)/.test(rule)) {
                        return { MaxLength: rule.replace('MaxLength(', '').replace(')', '') };
                    } else if (/MinLength\(\d+\)/.test(rule)) {
                        return { MinLength: rule.replace('MinLength(', '').replace(')', '') };
                    } else if (/FloatNumber\(\d+\)/.test(rule)) {
                        return { FloatNumber: rule.replace('FloatNumber(', '').replace(')', '') };
                    } else if (/MaxFloatNumber\((-?\d+)(\.\d+)?\)/.test(rule)) {
                        return { MaxFloatNumber: rule.replace('MaxFloatNumber(', '').replace(')', '') };
                    } else if (/MinFloatNumber\((-?\d+)(\.\d+)?\)/.test(rule)) {
                        return { MinFloatNumber: rule.replace('MinFloatNumber(', '').replace(')', '') };
                    }
                }
                return rule;
            });
            return newRules;
        },
        layoutType() {
            return this.schema.type;
        },
        layoutOptions() {
            return this.createOptions(this.schema.options);
        },
    },
    methods: {
        createOptions(options) {
            if (!options) return options;
            if (!Array.isArray(options)) {
                console.warn('[Schema] options must be array!', options);
                return [].concat(_.isUndefined(options) ? [] : options);
            }
            return options.map(item => {
                if (_.isString(item)) {
                    return { text: item, value: item };
                }
                return item;
            });
        },
    },
};
</script>

<style module>
.root {
    position: relative;
    margin-bottom: 20px;
}

.checkboxes {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.checkboxes > div {
    margin-right: 20px;
}
</style>
