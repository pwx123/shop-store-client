<template>
  <div class="safe">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"
        title="安全设置"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="重置登录密码" to="/safe/resetPwd"/>
      <van-cell :title="hasPayPwd ? '重置支付密码' : '设置支付密码'" @click="payPwdClick" is-link/>
    </van-cell-group>
  </div>
</template>

<script>
  import {handleServerError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect}) {
      try {
        let res = await $axios.$post("/user/hasPayPwd");
        if (res.errorCode === 200) {
          return {
            hasPayPwd: res.data
          };
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    },
    methods: {
      payPwdClick() {
        if (this.hasPayPwd) {
          this.$dialog.alert({
            title: "提示",
            message: "请联系客服 QQ 1813536955 重置密码"
          });
        } else {
          this.$router.push("/safe/setPayPwd");
        }
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .safe {
    padding-top 46px
  }
</style>
