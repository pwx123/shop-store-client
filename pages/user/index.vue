<template>
  <div class="user">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"
        title="个人信息"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" value="内容">
        <img :src="userInfo.avatarUrl ? userInfo.avatarUrl + getTimeUrl() : defaultAvatarUrl" alt="">
        <input @change="inputFileChange"
            accept="image/*"
            class="file"
            ref="file"
            type="file">
      </van-cell>
      <van-cell :value="sexMap[userInfo.sex]"
          @click="selectSex"
          is-link
          title="性别"/>
      <van-cell
          :value="userInfo.name"
          title="手机号"/>
      <van-cell
          :value="userInfo.nickname"
          @click="selectName"
          is-link
          title="姓名"/>
    </van-cell-group>
    <div class="logout">
      <van-button @click="logout" type="danger">退出登录</van-button>
    </div>
    <van-popup
        position="bottom"
        v-model="selectShow"
    >
      <van-picker :columns="sexData"
          :default-index="userInfo.sex"
          @cancel="selectShow = false"
          @confirm="onConfirm"
          show-toolbar
          title="选择性别"/>
    </van-popup>
    <van-dialog
        @cancel="cancel"
        @confirm="confirm"
        show-cancel-button
        title="上传头像"
        v-model="showDialog"
    >
      <div class="preview-img">
        <img :src="previewBase64">
      </div>
    </van-dialog>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
  import Loading from "../../components/loading";
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
    components: {Loading},
    data() {
      return {
        selectShow: false,
        showDialog: false,
        defaultAvatarUrl: this.baseUrl + "/images/admin/default.jpg",
        sexMap: {
          0: "男",
          1: "女"
        },
        sexData: ["男", "女"],
        previewBase64: "",
        uploadFile: null,
        loading: false
      };
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    methods: {
      async onConfirm(val, index) {
        this.selectShow = false;
        if (index !== this.userInfo.sex) {
          try {
            let res = await this.$axios.$post("/user/updateSex", {sex: index});
            if (res.errorCode === 200) {
              this.$notify({
                message: "修改成功",
                background: "#1989fa"
              });
              this.getUserInfo();
            } else {
              this.$notify({
                message: res.errorMsg
              });
            }
          } catch (err) {
            handleError(err, this.$router);
          }
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
      },
      // 上传图片
      async confirm() {
        try {
          let params = new FormData();
          params.append("avatar", this.uploadFile);
          let res = await this.$axios.$post("/user/updateAvatar", params);
          if (res.errorCode === 200) {
            this.$notify({
              message: "修改成功",
              background: "#1989fa"
            });
            this.getUserInfo();
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      inputFileChange() {
        let file = this.$refs.file.files[0];
        if (!file) {
          return false;
        }
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          this.$notify({
            message: "格式不支持"
          });
          return false;
        }
        if (file.size > 1024 * 1024 * 2) {
          this.$notify({
            message: "大小不能超过2M"
          });
          return false;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          this.previewBase64 = e.currentTarget.result;
          this.uploadFile = file;
          this.showDialog = true;
        };
      },
      // url加上时间参数
      getTimeUrl() {
        return `?t=${new Date().getTime()}`;
      },
      selectSex() {
        this.selectShow = true;
      },
      selectName() {
        this.$router.push({
          path: "/user/edit",
          query: {
            nickName: this.userInfo.nickname
          }
        });
      },
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
      },
      cancel() {
        this.showDialog = false;
        this.previewBase64 = "";
        this.uploadFile = null;
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

  .van-cell {
    align-items center

    .file {
      position absolute
      opacity 0
      left -100%
      top 0
      bottom 0
      width 100vh
      z-index 999
    }
  }

  .van-cell__value {
    img {
      width 30px
    }
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

  .preview-img {
    padding 10px 20px

    img {
      width 100%
    }
  }
</style>
