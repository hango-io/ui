module.exports = {
    "root": true,
    "extends": [
      "eslint-config-2o3t/vue"
    ],
    "rules": {
        "no-unused-vars": "warn",
        "vue/valid-v-slot": ["error", { "allowModifiers": true }],
    },
};
