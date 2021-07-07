import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import zhHans from 'vuetify/es5/locale/zh-Hans';
import en from 'vuetify/src/locale/en';

export default new Vuetify({
    lang: {
        locales: { zhHans, en },
        current: 'zhHans',
    },
    theme: {
        default: 'light',
        themes: {
            light: {
                primary: '#2d4983',
                secondary: '#00a3a3',
                // accent: '#82B1FF',
                // error: '#FF5252',
                // info: '#2196F3',
                // success: '#4CAF50',
                // warning: '#FB8C00',
            },
        },
    },
});
