<template>
    <span :class="$style.root"><slot></slot></span>
</template>
<script>
export default {
    name: 'g-label',
};
</script>
<style module>
.root {
    display: inline-block;
    position: relative;
}
</style>
