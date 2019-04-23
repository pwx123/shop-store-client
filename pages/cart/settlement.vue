<template>
  <div class="order">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"
        title="提交订单"></van-nav-bar>
    <div class="address">
      <div class="address-detail">
        {{hasDefault ? "彭文祥" : "选择/添加收货地址"}}
      </div>
      <div class="address-info" v-if="hasDefault">山东省烟台市芝罘区鲁东大学</div>
      <van-icon name="arrow"/>
      <van-icon name="location" v-if="hasDefault"/>
    </div>
    <van-panel title="商品">
      <van-card
          :key="item.id"
          :num="item.count"
          :origin-price="formatPrice(item.price)"
          :price="formatPrice(item.salePrice)"
          :thumb="item.imageUrl"
          :title="item.name"
          v-for="item in orderList">
        <div class="desc" slot="desc">
          {{item.description.length > 32 ? item.description.slice(0,32) + "..." : item.description}}
        </div>
      </van-card>
    </van-panel>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        hasDefault: true,
        orderList: [{
          "createdAt": "2019-04-23 17:04:06",
          "id": 6,
          "userId": 1,
          "bookId": 172,
          "count": 1,
          "name": "深度成长",
          "author": "科里•夏纳罕",
          "press": "台海出版社",
          "title": "颠覆思维模式，重新定义成功！",
          "description": "全面发展不如深度成长，很多人没有取得成功，是因为努力的方向太多，忽略了深挖自身的核心价值！",
          "price": 33,
          "salePrice": 20,
          "stock": 123,
          "imageUrl": "http://127.0.0.1/images/book/172.jpg"
        }, {
          "createdAt": "2019-04-23 17:04:15",
          "id": 7,
          "userId": 1,
          "bookId": 166,
          "count": 1,
          "name": "庆子绘本",
          "author": "庆子·凯萨兹",
          "press": "贵州人民出版社",
          "title": "精选图画书大师庆子·凯萨兹的上乘之作",
          "description": "包含母爱、自我认同、勇气等主题，荣获多项国际大奖。故事轻快诙谐，画面柔和明丽，语言短小精悍，蕴意深刻。孩子能在快乐的阅读体验中收获感动与成长。",
          "price": 64,
          "salePrice": 57,
          "stock": 100,
          "imageUrl": "http://127.0.0.1/images/book/166.jpg"
        }]
      };
    },
    methods: {
      formatPrice(price) {
        return price.toFixed(2);
      },
    }
  };
</script>

<style lang="stylus" scoped>
  .order {
    height 100vh
    background-color #eee
  }

  .address {
    position relative
    padding-top 46px
    line-height 36px
    font-weight bold
    background-color #fff

    .address-detail {
      padding-left 34px
      font-size 16px
    }

    .address-info {
      font-size 13px
      line-height 1
      font-weight normal
      margin-bottom 10px
      padding-left 34px
      color #7F828B
    }

    &::after {
      content ''
      display block
      height 2px
      background -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50%)
      background repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50%)
      background-size 80px
    }

    .van-icon-arrow {
      position absolute
      right 10px
      top 57px
      font-weight bold
    }

    .van-icon-location {
      position absolute
      left 10px
      top 58px
      font-weight bold
    }
  }

  .van-panel {
    margin-top 14px
  }
</style>
