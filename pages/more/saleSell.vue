<template>
  <div class="sale-sell">
    <van-nav-bar
        @click-left="$router.go(-1)"
        left-arrow
        left-text="返回"
        title="促销商品"
    />
    <tab-item :data="saleSell" @showGood="showGood"></tab-item>
  </div>
</template>

<script>
  import tabItem from "../../components/tabItem";
  import {handleServerError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect, query}) {
      try {
        let res = await $axios.$post("/book/getSaleGood", {all: 1});
        if (res.errorCode === 200) {
          return {
            saleSell: res.data || []
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
  .sale-sell {
    background-color #eee
    min-height 100vh
  }
</style>
