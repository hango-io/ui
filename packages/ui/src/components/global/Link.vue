<template>
    <router-link class="primary-text" :class="$style.root" v-bind="$attrs" v-on="$listeners"><slot></slot></router-link>
</template>
<script>
export default {
    name: 'g-link',
};
</script>
<style module>
.root {
    text-decoration: none;
    display: inline-block;
    position: relative;
}
.root:hover {
    text-decoration: underline;
}
</style>
