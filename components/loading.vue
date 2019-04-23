<template>
  <div class="loading" v-if="loading">
    <van-loading color="white"/>
  </div>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default: true
      }
    }
  };
</script>

<style lang="stylus">
  .loading {
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background-color #fff

    .van-loading {
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      width 50px
      height 50px
      padding 10px
      border-radius 3px
      background-color rgba(0, 0, 0, 0.5)
    }
  }
</style>
