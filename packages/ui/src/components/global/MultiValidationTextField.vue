<template>
    <div class="mb-6">
        <validation-provider
            v-for="(item, index) in list"
            :key="index"
            v-slot="{ errors }"
            :name="label"
            :rules="rules"
        >
            <v-text-field
                :label="`${label}*`"
                v-model="item.value"
                :error-messages="errors"
                v-bind="$attrs"
            >
                <template #append-outer>
                    <v-btn
                        :disabled="list.length <= min"
                        color="error"
                        icon
                        @click="() => list.length > min ? list.splice(index, 1) : null"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </validation-provider>
        <v-btn block color="primary" @click="() => list.push({ value: '' })">添加一个</v-btn>
    </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate';
export default {
    name: 'g-multi-validation-text-field',
    components: {
        ValidationProvider,
    },
    model: {
        prop: 'value',
        event: 'input',
    },
    props: {
        value: [ Array, String ],
        label: {
            type: String,
            required: true,
        },
        returnType: {
            type: String,
            default: 'array',
        },
        min: {
            type: Number,
            default: 1,
        },
        rules: String,
    },
    data() {
        return {
            list: [],
        };
    },
    watch: {
        value: {
            handler(v, oV) {
                const nVText = JSON.stringify(v);
                const oVText = JSON.stringify(oV);
                if (nVText === oVText) {
                    return;
                }
                v = JSON.parse(nVText);
                if (this.returnType === 'string') {
                    v = v.split(',');
                }
                this.list = v.map(value => ({ value }));
            },
            immediate: true,
        },
        list: {
            handler(v) {
                let vals = v.map(item => item.value);
                if (this.returnType === 'string') {
                    vals = vals.join(',');
                }
                this.$emit('input', vals);
            },
            deep: true,
        },
    },
};
</script>
