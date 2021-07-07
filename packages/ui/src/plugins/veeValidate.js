
import * as rules from 'vee-validate/dist/rules';
import { extend, setInteractionMode } from 'vee-validate';
import { messages } from 'vee-validate/dist/locale/zh_CN.json';

Object.keys(rules).forEach(rule => {
    extend(rule, {
        ...rules[rule],
        message: messages[rule],
    });
});

const { required, numeric, email, max, min, regex, max_value, min_value } = rules || {};
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
