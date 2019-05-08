<template>
  <div class="error">
    <img alt="rest"
        src="./../assets/img/error.png">
    <div v-if="statusCode === 404">
      页面找不到了
    </div>
    <div v-else>
      {{message}}
    </div>
    <van-button plain
        round
        size="small"
        to="/"
        type="primary">回到首页
    </van-button>
  </div>
</template>

<script>
  export default {
    props: {
      error: {
        type: Object,
        default: null
      }
    },
    computed: {
      statusCode() {
        return (this.error && this.error.statusCode) || 500;
      },
      message() {
        return this.error.message || "系统出现错误";
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .error {
    text-align center
    background-color #F7F8FB
    height 100vh
    padding-top 50%
    color #47494e
    font-size 20px

    img {
      width 30%
      margin-bottom 20px
    }

    .van-button {
      margin-top 10px
    }
  }
</style>
