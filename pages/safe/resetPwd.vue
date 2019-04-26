<template>
  <div class="reset">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"
        title="重置登录密码"></van-nav-bar>
    <van-cell-group>
      <van-field
          :error-message="pwdInfoErr.oldPwdErr"
          clearable
          label="原密码"
          placeholder="请输入原密码"
          type="password"
          v-model="pwdInfo.oldPwd"
      />
      <van-field
          :error-message="pwdInfoErr.newPwdErr"
          clearable
          label="新密码"
          maxlength="11"
          placeholder="8-16 位数字、字母组合"
          type="password"
          v-model="pwdInfo.newPwd"
      />
      <van-field
          :error-message="pwdInfoErr.repNewPwdErr"
          clearable
          label="重复新密码"
          placeholder="请重复输入新密码"
          type="password"
          v-model="pwdInfo.repNewPwd"
      />
    </van-cell-group>
    <div class="btn-group">
      <van-button @click="submitUpdatePwd" type="danger">确定</van-button>
    </div>
  </div>
</template>

<script>
  import MD5 from "crypto-js/md5";
  import {pwdReg, handleError} from "../../utils/utils";

  // 只在客户端加载
  if (process.client) {
    require("jsencrypt").JSEncrypt;
  }

  export default {
    data() {
      return {
        pwdInfo: {
          oldPwd: "",
          newPwd: "",
          repNewPwd: ""
        },
        pwdInfoErr: {
          oldPwdErr: "",
          newPwdErr: "",
          repNewPwdErr: ""
        }
      };
    },
    methods: {
      async submitUpdatePwd() {
        this.pwdInfoErr = {
          oldPwdErr: "",
          newPwdErr: "",
          repNewPwdErr: ""
        };
        if (!pwdReg.test(this.pwdInfo.oldPwd)) {
          this.pwdInfoErr.oldPwdErr = "请输入正确格式的密码";
          return false;
        }
        if (!pwdReg.test(this.pwdInfo.newPwd)) {
          this.pwdInfoErr.newPwdErr = "请输入正确格式的密码";
          return false;
        }
        if (this.pwdInfo.newPwd !== this.pwdInfo.repNewPwd) {
          this.pwdInfoErr.repNewPwdErr = "两次输入的密码不一致";
          return false;
        }
        try {
          let res = await this.$axios.$post("/getPublicKey");
          if (res.errorCode === 200) {
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(res.data);
            let md5Pwd = MD5(this.pwdInfo.oldPwd).toString();
            let md5NewPwd = MD5(this.pwdInfo.newPwd).toString();
            let md5RepNewPwd = MD5(this.pwdInfo.repNewPwd).toString();
            let pwd = encodeURI(encryptor.encrypt(md5Pwd));
            let newPwd = encodeURI(encryptor.encrypt(md5NewPwd));
            let repNewPwd = encodeURI(encryptor.encrypt(md5RepNewPwd));
            let pwdRes = await this.$axios.$post("/user/updatePassword", {pwd, newPwd, repNewPwd});
            this.pwdInfo = {
              oldPwd: "",
              newPwd: "",
              repNewPwd: ""
            };
            if (pwdRes.errorCode === 200) {
              this.$dialog.alert({
                title: "提示",
                message: "密码重置成功，请重新登录"
              }).then(() => {
                this.$router.push("/login");
              });
            } else {
              this.$notify({
                message: pwdRes.errorMsg
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
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .reset {
    padding-top 46px
    background-color #f2f3f5
    height 100vh

    .btn-group {
      padding 20px

      .van-button {
        width 100%
        margin-top 10px
      }
    }
  }
</style>
