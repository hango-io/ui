
import * as rules from 'vee-validate/dist/rules';
import { extend, setInteractionMode } from 'vee-validate';
import { messages } from 'vee-validate/dist/locale/zh_CN.json';

Object.keys(rules).forEach(rule => {
    extend(rule, {
        ...rules[rule],
        message: messages[rule],
    });
});

const { required, numeric, email, max, min, regex, max_value, min_value, integer } = rules || {};
setInteractionMode('eager');
extend('required', {
    ...required,
    message: (fieldName, placeholders) => {
        return `${fieldName.replace(/\*$/, '')} 不能为空`;
    },
});
extend('Required', {
    ...required,
    message: (fieldName, placeholders) => {
        return `${fieldName.replace(/\*$/, '')} 不能为空`;
    },
});
// extend('email', {
//     ...email,
//     message: '{_field_} 格式不正确',
// });
extend('Number', {
    ...numeric,
    message: (fieldName, placeholders) => {
        return `${fieldName.replace(/\*$/, '')} 必须为数字类型`;
    },
});
extend('MaxNumber', {
    ...max_value,
    message: (fieldName, placeholders) => {
        return `${fieldName.replace(/\*$/, '')} 必须小于 ${placeholders.max}`;
    },
});
extend('MinNumber', {
    ...min_value,
    message: (fieldName, placeholders) => {
        console.log(min_value, placeholders);
        return `${fieldName.replace(/\*$/, '')} 必须大于 ${placeholders.min}`;
    },
});
extend('MaxLength', {
    ...max,
    message: (fieldName, placeholders) => {
        return `${fieldName.replace(/\*$/, '')} 必须小于 ${placeholders.length} 个字符`;
    },
});
extend('MinLength', {
    ...min,
    message: (fieldName, placeholders) => {
        return `${fieldName.replace(/\*$/, '')} 必须大于 ${placeholders.length} 个字符`;
    },
});
extend('FloatNumber', {
    ...min,
    validate(value, { length }) {
        const regex = new RegExp(`^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{0,${length}})?$`);
        return regex.test(value);
    },
    message: (fieldName, placeholders) => {
        return `请输入有效的数字, 且最多${placeholders.length}位小数`;
    },
});
extend('MaxFloatNumber', {
    ...max,
    validate(value, { length }) {
        length = parseFloat(length);
        if (Array.isArray(value)) {
            if (value.some(item => parseFloat(item) > length)) {
                return false;
            }
            return true;
        }
        return parseFloat(value) < length;
    },
    message: (fieldName, placeholders) => {
        return `不可以大于${placeholders.length}`;
    },
});
extend('MinFloatNumber', {
    ...min,
    validate(value, { length }) {
        length = parseFloat(length);
        if (Array.isArray(value)) {
            if (value.some(item => parseFloat(item) < length)) {
                return false;
            }
            return true;
        }
        return parseFloat(value) > length;
    },
    message: (fieldName, placeholders) => {
        return `不可以小于${placeholders.length}`;
    },
});
extend('Unique', {
    ...min,
    validate(value, { length }) {
        if (Array.isArray(value) && [ ...new Set(value) ].length !== value.length) {
            clearTimeout(this.__iTimerUnique);
            this.__iTimerUnique = setTimeout(() => { // 重复删除
                const arrs = [ ...new Set(value) ];
                value.length = 0;
                value.push(...arrs);
            }, 1000);
            return false;
        }
        return true;
    },
    message: (fieldName, placeholders) => {
        return '不可输入重复的值';
    },
});
extend('Integer', {
    ...integer,
    message: (fieldName, placeholders) => {
        return `${fieldName.replace(/\*$/, '')} 必须为整数`;
    },
});
