<template>
  <v-container fluid>
    <v-breadcrumbs
        class="pl-3"
        v-if="$route.meta && $route.meta.breadcrumbs"
        large
        :items="$route.meta.breadcrumbs"
    ></v-breadcrumbs>
    <div>

    </div>
  </v-container>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            loading: true,
        };
    },
    mounted() {
    },
    methods: {
    },
};
</script>
