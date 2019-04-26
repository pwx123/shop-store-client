<template>
  <div class="paw-pwd">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        @click-right="setComplete"
        fixed
        left-arrow
        left-text="返回"
        right-text="完成"
        title="输入支付密码"></van-nav-bar>
    <van-password-input
        :value="payPwdValue"
        info="密码为 6 位数字"/>
    <van-number-keyboard
        :show="showKeyboard"
        @delete="onDelete"
        @input="onInput"
    />
  </div>
</template>

<script>
  import MD5 from "crypto-js/md5";
  import {handleError} from "../../utils/utils";

  // 只在客户端加载
  if (process.client) {
    require("jsencrypt").JSEncrypt;
  }

  export default {
    data() {
      return {
        payPwdValue: "",
        showKeyboard: true
      };
    },
    mounted() {
      this.getHasPayPwd();
    },
    methods: {
      // 判断是否设置支付密码
      async getHasPayPwd() {
        try {
          let res = await this.$axios.$post("/user/hasPayPwd");
          if (res.errorCode === 200) {
            let hasPayPwd = res.data;
            if (!hasPayPwd) {
              this.$dialog.confirm({
                title: "提示",
                message: "您还未设置支付密码，请先设置支付密码"
              }).then(() => {
                this.$router.push("/safe/setPayPwd");
              }).catch(() => {
                this.$router.go(-1);
              });
            }
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 完成步骤
      async setComplete() {
        if (this.payPwdValue.length !== 6) {
          this.$toast("请输入6位数密码");
          return false;
        }
        try {
          let res = await this.$axios.$post("/getPublicKey");
          if (res.errorCode === 200) {
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(res.data);
            let md5Pwd = MD5(this.payPwdValue).toString();
            let payPwd = encodeURI(encryptor.encrypt(md5Pwd));
            let logRes = await this.$axios.$post("/user/validPayPwd", {payPwd});
            if (logRes.errorCode === 200) {
              let statusRes = await this.$axios.$post("/order/setOrderPayment", {orderId: this.$route.query.orderId});
              if (statusRes.errorCode === 200) {
                this.$dialog.alert({
                  title: "提示",
                  message: "支付成功，我们会尽快未您发货"
                }).then(() => {
                  this.$router.push("/userIndex");
                });
              } else {
                this.$notify({
                  message: statusRes.errorMsg
                });
              }
            } else {
              this.payPwdValue = "";
              this.$notify({
                message: logRes.errorMsg
              });
            }
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      onInput(key) {
        this.payPwdValue = (this.payPwdValue + key).slice(0, 6);
      },
      onDelete() {
        this.payPwdValue = this.payPwdValue.slice(0, this.payPwdValue.length - 1);
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .paw-pwd {
    padding-top 46px
    background-color #f8f8f8
    height 100vh
  }

  .van-password-input {
    margin-top 40px
  }
</style>
