<template>
  <div>
    <van-tabbar v-model="activeNav" :z-index="999">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="cart-o" to="/cartIndex">购物车</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/userIndex">我的</van-tabbar-item>
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
  };
</script>

<style lang="stylus">

</style>
