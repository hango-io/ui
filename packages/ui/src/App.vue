<template>
  <v-app id="app">

    <HeaderComp/>

    <MenusComp/>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <GlobalNotifyComp ref="globalMessageRef"/>
      <GlobalConfirmComp ref="globalConfirmRef"/>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>

    <div :class="$style.waterBgMask">
       <div :class="$style.waterBgImg"></div>
    </div>
  </v-app>
</template>

<script>
import HeaderComp from './components/Header';
import MenusComp from './components/Menus';
import GlobalNotifyComp from './components/GlobalNotify';
import GlobalConfirmComp from './components/GlobalConfirm';
import Vue from 'vue';
export default {
    components: { HeaderComp, MenusComp, GlobalNotifyComp, GlobalConfirmComp },
    created() {
        Vue.$notify = Vue.prototype.$notify = {
            error: message => this.$refs.globalMessageRef.show({
                color: 'error',
                message,
            }),
            success: message => this.$refs.globalMessageRef.show({
                color: 'success',
                message,
            }),
            warn: message => this.$refs.globalMessageRef.show({
                color: 'warning',
                message,
            }),
            show: message => this.$refs.globalMessageRef.show({
                message,
            }),
        };
        Vue.$confirm = Vue.prototype.$confirm = opt => {
            return this.$refs.globalConfirmRef.show(opt);
        };
    },
};
</script>

<style lang="scss" module>
.waterBgMask {
    position: absolute;
    z-index: 99999;
    opacity: 0.05;
    filter: alpha(opacity=5);
    pointer-events: none;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}
.waterBgImg {
    background: url('~@/assets/logo.svg') no-repeat center center;
    width: 100%;
    height: 100%;
    max-width: 60%;
    margin: auto;
}
</style>
