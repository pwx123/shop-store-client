<template>
  <div class="hot-sell">
    <van-nav-bar
        @click-left="$router.go(-1)"
        left-arrow
        left-text="返回"
        title="热销商品"
    />
    <tab-item :data="hotData" @showGood="showGood"></tab-item>
  </div>
</template>

<script>
  import tabItem from "../../components/tabItem";
  import {handleServerError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect, query}) {
      try {
        let res = await $axios.$post("/book/getHotGood", {all: 1});
        if (res.errorCode === 200) {
          return {
            hotData: res.data || []
          };
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    },
    data() {
      return {};
    },
    methods: {
      // 跳转商品详情
      showGood(id) {
        this.$router.push({
          path: "/good/detail",
          query: {
            id
          }
        });
      },
    },
    components: {
      tabItem
    }
  };
</script>

<style lang="stylus" scoped>
  .hot-sell {
    background-color #eee
    min-height 100vh
  }
</style>
