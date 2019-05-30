<template>
  <div id="login">
    <div class="logo">
      <img alt="logo"
          src="./../assets/img/logo.jpg">
    </div>
    <h3>新用户注册</h3>
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
          placeholder="8-16位数字和字母组合"
          size="large"
          type="password"
          v-model="loginParams.pwd"/>
      <van-field :error-message="loginValidate.repPwd"
          clearable
          placeholder="请再次输入密码"
          size="large"
          type="password"
          v-model="loginParams.repPwd"/>
    </div>
    <van-button @click="submitRegister"
        round
        type="primary">注册
    </van-button>
    <van-button @click="backLogin"
        plain
        round
        type="info">已注册？立即登录
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
          name: "",
          pwd: "",
          repPwd: ""
        },
        loginValidate: {
          name: "",
          pwd: "",
          repPwd: ""
        }
      };
    },
    methods: {
      // 注册
      async submitRegister() {
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
        if (this.loginParams.repPwd !== this.loginParams.pwd) {
          this.loginValidate.repPwd = "两次密码不一致";
          return false;
        }
        try {
          let res = await this.$axios.$post("/getPublicKey");
          if (res.errorCode === 200) {
            let name = this.loginParams.name;
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(res.data);
            let md5Pwd = MD5(this.loginParams.pwd).toString();
            let md5RepPwd = MD5(this.loginParams.repPwd).toString();
            let pwd = encodeURI(encryptor.encrypt(md5Pwd));
            let repPwd = encodeURI(encryptor.encrypt(md5RepPwd));
            let logRes = await this.$axios.$post("/user/register", {name, pwd, repPwd});
            if (logRes.errorCode === 200) {
              this.$notify({
                message: "注册成功",
                background: "#1989fa",
                duration: 1000
              });
              setTimeout(() => {
                this.$router.push("/login");
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
      backLogin() {
        this.$router.push("/login");
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
      margin-top 20px
      width 80%
    }
  }
</style>
