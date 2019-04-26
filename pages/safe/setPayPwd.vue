<template>
  <div class="paw-pwd">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        @click-right="setComplete"
        fixed
        left-arrow
        left-text="返回"
        right-text="完成"
        title="设置支付密码"></van-nav-bar>
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
        payPwdStep: {
          payPwd: "",
          repPayPwd: ""
        },
        isFirst: true,
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
            if (hasPayPwd) {
              this.$dialog.alert({
                title: "提示",
                message: "您已设置支付密码，重置支付密码请联系客服 QQ 1813536955"
              }).then(() => {
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
      setComplete() {
        if (this.payPwdValue.length !== 6) {
          this.$toast("请输入6位数密码");
          return false;
        }
        if (this.isFirst) {
          this.payPwdStep.payPwd = this.payPwdValue;
          this.payPwdValue = "";
          this.isFirst = false;
          this.$toast("请重复输入密码");
        } else {
          this.payPwdStep.repPayPwd = this.payPwdValue;
          if (this.payPwdStep.payPwd !== this.payPwdStep.repPayPwd) {
            this.isFirst = true;
            this.payPwdValue = "";
            this.payPwdStep = {
              payPwd: "",
              repPayPwd: ""
            };
            this.$dialog.alert({
              title: "提示",
              message: "两次输入的密码不一致，请重新输入"
            }).then(() => {
              this.$toast("请输入密码");
            });
          } else {
            this.setPayPwd();
          }
        }
      },
      // 设置密码请求
      async setPayPwd() {
        try {
          let res = await this.$axios.$post("/getPublicKey");
          if (res.errorCode === 200) {
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(res.data);
            let md5Pwd = MD5(this.payPwdValue).toString();
            let payPwd = encodeURI(encryptor.encrypt(md5Pwd));
            let logRes = await this.$axios.$post("/user/setPayPwd", {payPwd});
            if (logRes.errorCode === 200) {
              this.$notify({
                message: "设置成功",
                duration: 1000,
                background: "#1989fa"
              });
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            } else {
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
