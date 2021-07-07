import Vue from 'vue';

const files = require.context('./global', true, /\.vue$/im);

const Components = files.keys().map(key => {
    let file = files(key);
    if (file.default) {
        file = file.default;
    }
    return file;
});

Components.forEach(Component => {
    const name = typeof Component === 'function' ? Component.options.name : Component.name;
    name && Vue.component(name, Component);
});

// load plugin schema
import './schema';
