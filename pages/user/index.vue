<template>
  <div class="user">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"
        title="个人信息"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" value="内容"/>
      <van-cell :value="sexMap[userInfo.sex]" is-link title="性别"/>
      <van-cell :value="userInfo.name" title="手机号"/>
      <van-cell :value="userInfo.nickname" is-link title="姓名"/>
    </van-cell-group>
    <div class="logout">
      <van-button @click="logout" type="danger">退出登录</van-button>
    </div>
  </div>
</template>

<script>
  import {handleServerError, handleError} from "../../utils/utils";
  import {mapGetters} from "vuex";

  export default {
    async fetch({$axios, error, redirect, store}) {
      if (!store.getters.userInfo.name) {
        try {
          let res = await $axios.$post("/user/getUserInfo");
          if (res.errorCode === 200) {
            store.commit("SET_USERINFO", res.data);
          } else {
            handleServerError("", error, redirect);
          }
        } catch (err) {
          handleServerError(err, error, redirect);
        }
      }
    },
    data() {
      return {
        sexMap: {
          0: "男",
          1: "女"
        }
      };
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    methods: {
      logout() {
        this.$dialog.confirm({
          title: "提示",
          message: "确定退出登录吗？"
        }).then(async () => {
          try {
            let res = await this.$axios.$post("/user/logout");
            if (res.errorCode === 200) {
              this.$router.replace("/login");
            } else {
              this.$notify({
                message: res.errorMsg
              });
            }
          } catch (err) {
            handleError(err, this.$router);
          }
        }).catch(() => {
        });
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .user {
    padding-top 46px
    min-height 100vh
    background-color #fafafa
  }

  .logout {
    display flex
    margin-top 30px
    justify-content center

    .van-button {
      width 80%
      margin 10px auto
    }
  }

</style>
