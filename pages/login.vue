<template>
  <div id="login">
    <div class="logo">
      <img alt="logo"
          src="./../assets/img/logo.jpg">
    </div>
    <h3>登录书城</h3>
    <div class="login-input">
      <van-field :error-message="loginValidate.name"
          clearable
          maxlength="11"
          placeholder="请输入手机号"
          size="large"
          type="tel"
          v-model="loginParams.name"/>
      <van-field :error-message="loginValidate.pwd"
          clearable
          placeholder="请输入密码"
          size="large"
          type="password"
          v-model="loginParams.pwd"/>
    </div>
    <div class="login-tips">
      <span @click="forgetPwd"
          class="forget-pwd">忘记密码？</span>
      <span @click="goRegister">立即注册</span>
    </div>
    <van-button @click="submitLogin"
        round
        type="primary">登录
    </van-button>
  </div>
</template>

<script>
  import MD5 from "crypto-js/md5";
  import {pwdReg, mobileReg, handleError} from "../utils/utils";

  // 只在客户端加载
  if (process.client) {
    require("jsencrypt").JSEncrypt;
  }

  export default {
    data() {
      return {
        loginParams: {
          name: "15553598112",
          pwd: "pwx98010101"
        },
        loginValidate: {
          name: "",
          pwd: ""
        }
      };
    },
    methods: {
      // 登录
      async submitLogin() {
        this.loginValidate = {
          name: "",
          pwd: ""
        };
        if (!mobileReg.test(this.loginParams.name)) {
          this.loginValidate.name = "请输入正确的手机号";
          return false;
        }
        if (!pwdReg.test(this.loginParams.pwd)) {
          this.loginValidate.pwd = "请输入正确格式的密码";
          return false;
        }
        try {
          let res = await this.$axios.$post("/getPublicKey");
          if (res.errorCode === 200) {
            let name = this.loginParams.name;
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(res.data);
            let md5Pwd = MD5(this.loginParams.pwd).toString();
            let pwd = encodeURI(encryptor.encrypt(md5Pwd));
            let logRes = await this.$axios.$post("/user/login", {name, pwd});
            if (logRes.errorCode === 200) {
              this.$notify({
                message: "登陆成功",
                duration: 1000,
                background: "#1989fa"
              });
              setTimeout(() => {
                this.$router.push("/");
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
      forgetPwd() {
        this.$dialog.alert({
          title: "提示",
          message: "请联系客服 QQ 1813536955 重置密码"
        });
      },
      goRegister() {
        this.$router.push("/register");
      }
    }
  };
</script>

<style lang="stylus"
    scoped>
  #login {
    text-align center

    .logo {
      padding 60px 0 10px 0

      img {
        width 100px
      }
    }

    .login-input {
      padding 20px 20px 10px 20px

      .van-field {
        font-size 14px
        border-bottom 1px solid #07c160
      }
    }

    .login-tips {
      display flex
      justify-content space-between
      padding 0 22px
      font-size 14px
      color #7F828B
    }

    .van-button {
      margin-top 30px
      width 80%
    }
  }
</style>
