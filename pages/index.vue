<template>
  <div>
    <van-tabbar :z-index="999" v-model="activeNav">
      <van-tabbar-item icon="home-o" replace to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="cart-o" replace to="/cartIndex">购物车</van-tabbar-item>
      <van-tabbar-item icon="friends-o" replace to="/userIndex">我的</van-tabbar-item>
    </van-tabbar>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeNav: 0
      };
    },
    mounted() {
      this.getActiveNav();
    },
    methods: {
      getActiveNav() {
        let path = this.$route.path;
        switch (path) {
          case "/" :
            this.activeNav = 0;
            break;
          case "/cartIndex" :
            this.activeNav = 1;
            break;
          case "/userIndex" :
            this.activeNav = 2;
            break;
          default:
            this.activeNav = 0;
        }
      }
    },
    watch: {
      $route() {
        this.getActiveNav();
      }
    }
  };
</script>

<style lang="stylus">

</style>
