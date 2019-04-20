<template>
  <div class="tab-item">
    <div :key="item.id"
        @click="showGood(item.id)"
        class="item"
        v-for="item in data">
      <div class="item-detail">
        <img alt=""
            v-lazy="item.imageUrl">
        <div class="desc">{{item.description}}</div>
        <div class="price">
          <span class="new-price">￥{{item.salePrice}}</span>
          <span class="old-price">
            <del>￥{{item.price}}</del>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      showGood(id) {
        this.$emit('showGood', id);
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .tab-item {
    display flex
    flex-wrap wrap

    .item {
      width 50%

      &:nth-child(2n) .item-detail {
        margin-right 6px
      }

      &:nth-last-child(1) .item-detail, &:nth-last-child(2) .item-detail {
        margin-bottom 6px
      }

      .item-detail {
        background-color #fff
        margin 6px 0 0 6px

        img {
          width 100%
          height 180px
        }

        .desc {
          height 36px
          padding 4px
          font-size 14px
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 2
          overflow hidden
        }

        .new-price {
          margin-left 2px
          color #ff4c0a
        }

        .old-price {
          font-size 12px
          color #333
          margin-left 6px
        }
      }
    }
  }
</style>
