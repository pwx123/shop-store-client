<template>
  <transition name="slide">
    <div class="good">
      <div @click="goBack"
          class="back-btn">
        <van-icon name="arrow-left"/>
      </div>
      <van-swipe>
        <van-swipe-item :key="index"
            v-for="(item,index) in goodSwipeImg">
          <img v-lazy="item"/>
        </van-swipe-item>
      </van-swipe>
      <div class="info">
        <div class="name">{{goodDetail.name}}</div>
        <div class="title">{{goodDetail.title}}</div>
        <div class="description">{{goodDetail.description}}</div>
        <div class="price">
          <span class="sell-price">{{goodDetail.price | money}}</span>
          <span class="sale-price">
            <del>{{goodDetail.salePrice | money}}</del>
          </span>
        </div>
      </div>
      <van-cell-group class="cell-detail">
        <van-cell class="good-count" title="数量">
          <van-stepper
              :max="10"
              :min="1"
              input-width="60px"
              integer
              v-model="count"
          />
        </van-cell>
      </van-cell-group>

      <van-cell-group>
        <van-cell is-link title="作者">
          {{goodDetail.author}}
        </van-cell>
        <van-cell is-link title="出版社">
          {{goodDetail.press}}
        </van-cell>
      </van-cell-group>
      <van-cell-group class="cell-detail">
        <van-cell @click="scrollToDetail"
            is-link
            title="查看商品详情"/>
      </van-cell-group>
      <div class="detail"
          ref="detail">
        <img :src="goodDetailImg">
      </div>
      <van-goods-action>
        <van-goods-action-mini-btn icon="shopping-cart-o"
            text="购物车"
            to="/cartIndex"/>
        <van-goods-action-mini-btn icon="wap-home"
            text="首页"
            to="/"/>
        <van-goods-action-big-btn @click="addCartClick"
            text="加入购物车"/>
        <van-goods-action-big-btn @click="bugNowClick"
            primary
            text="立即购买"/>
      </van-goods-action>
    </div>
  </transition>
</template>

<script>
  import {handleServerError, handleError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect, query}) {
      try {
        if (!query.id) {
          redirect("/");
        }
        let res = await $axios.$post("/book/getBookInfoById", {id: query.id});
        if (res.errorCode === 200) {
          return {
            goodDetail: res.data || {}
          };
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    },
    data() {
      return {
        count: 1,
        goodSwipeImg: [
          this.baseUrl + "/images/shop/good/good-swipe/good-swipe-1.jpg",
          this.baseUrl + "/images/shop/good/good-swipe/good-swipe-2.jpg",
          this.baseUrl + "/images/shop/good/good-swipe/good-swipe-3.jpg",
          this.baseUrl + "/images/shop/good/good-swipe/good-swipe-4.jpg",
        ],
        goodDetailImg: [
          this.baseUrl + "/images/shop/good/good-detail/good-detail-1.jpg"
        ]
      };
    },
    mounted() {
    },
    computed: {},
    methods: {
      bugNowClick() {
        localStorage.setItem("settlementList", JSON.stringify([this.goodDetail.id]));
        localStorage.setItem("isSettlement", "true");
        localStorage.removeItem("selectAddress");
        this.$router.push({
          path: '/cart/settlement',
          query: {
            type: 1,
            count: this.count
          }
        });
      },
      async addCartClick() {
        let params = {
          bookId: this.$route.query.id,
          count: this.count
        };
        try {
          let res = await this.$axios.$post("/cart/addCart", params);
          if (res.errorCode === 200) {
            this.$notify({
              message: "添加成功",
              background: "#1989fa"
            });
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      scrollToDetail() {
        this.$refs.detail.scrollIntoView();
      },
      goBack() {
        this.$router.go(-1);
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .good {
    padding-bottom 50px
    background-color #eee

    .back-btn {
      position fixed
      z-index 999
      top 10px
      left 10px
      width 30px
      height 30px
      border-radius 50%
      color #fff
      line-height 32px
      text-align center
      background-color rgba(102, 102, 102, 0.4)

      i {
        font-weight 700
        margin-left -2px
        margin-top 4px
      }
    }
  }

  .van-swipe {
    height 375px
    padding-bottom 10px
    border-bottom 1px solid #eee
    background-color #fff

    .van-swipe-item {
      text-align center

      img {
        height 360px
      }
    }
  }

  .info {
    padding 4px 10px
    background-color #fff

    .name {
      font-size 18px
      font-weight bold
      line-height 28px
      margin-top 6px
    }

    .title {
      font-size 14px
      color #4d525d
      line-height 26px
      word-break break-all
    }

    .description {
      font-size 12px
      color #969696
      line-height 18px
      word-break break-all
    }

    .price {
      margin-top 10px

      .sell-price {
        color #f00
        font-size 18px
        margin-right 10px
      }

      .sale-price {
        color #969696
        font-size 12px
      }
    }
  }

  .van-cell-group {
    border-top 1px solid #eee
  }

  .cell-detail {
    margin-top 6px
    margin-bottom 6px
  }

  .good-count {

  }

  .detail img {
    width 100%
    height auto
  }
</style>
