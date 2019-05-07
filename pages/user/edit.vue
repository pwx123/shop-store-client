<template>
  <div class="edit">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        @click-right="setComplete"
        fixed
        left-arrow
        left-text="返回"
        right-text="完成"
        title="修改个人信息"></van-nav-bar>
    <van-cell-group>
      <van-field
          :error-message="errMsg"
          label="姓名"
          maxlength="20"
          placeholder="请输入姓名"
          v-model="nickName"
      />
    </van-cell-group>
  </div>
</template>

<script>
  import {handleError} from "../../utils/utils";

  export default {
    data() {
      return {
        nickName: "",
        errMsg: ""
      };
    },
    created() {
      this.nickName = this.$route.query.nickName;
    },
    methods: {
      async setComplete() {
        this.errMsg = "";
        if (this.nickName === "") {
          this.errMsg = "请输入姓名";
          return false;
        }
        try {
          let res = await this.$axios.$post("/user/updateNickname", {nickname: this.nickName});
          if (res.errorCode === 200) {
            this.$notify({
              message: "修改成功",
              background: "#1989fa"
            });
            this.getUserInfo();
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      async getUserInfo() {
        try {
          let res = await this.$axios.$post("/user/getUserInfo");
          if (res.errorCode === 200) {
            this.$store.commit("SET_USERINFO", res.data);
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
  .edit {
    padding-top 50px
    min-height 100vh
    background-color #fafafa
  }
</style>
