<template>
  <div class="about">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"
        title="关于我们"></van-nav-bar>
    <div class="content">
      <h3>{{shopInfo.shopName}}</h3>
      <p v-html="shopInfo.description">
      </p>
    </div>
  </div>
</template>

<script>
  import {handleServerError} from "../utils/utils";

  export default {
    async asyncData({$axios, error, redirect}) {
      try {
        let res = await $axios.$post("/shop/getShopInfo");
        if (res.errorCode === 200) {
          return {
            shopInfo: res.data || {}
          };
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .about {
    padding-top 46px
  }

  .content {
    padding 10px

    h3 {
      text-align center
    }

    p {
      text-indent 30px
      margin-top 20px
      font-size 14px
      color #7F828B
    }
  }
</style>
