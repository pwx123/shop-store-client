<template>
  <div class="home">
    <van-search @search="onSearch"
        placeholder="请输入搜索关键词"
        show-action
        v-model="searchValue">
      <div @click="onSearch"
          slot="action">搜索
      </div>
    </van-search>
    <div class="home-swipe">
      <div class="home-swipe-head">
        <span class="recommend">今日推荐</span>
        <span class="tips">每天都有新发现</span>
        <span class="swipe-num">
      <span class="indexPage">{{indexPage+1}}</span>
      <span class="pageNum">/4</span>
    </span>
      </div>
      <van-swipe :autoplay="3000"
          @change="changeSwipe">
        <van-swipe-item :key="index"
            @click="linkSwipe(item.id)" v-for="(item, index) in images">
          <img v-lazy="item.url"/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <good-item describe="每日热销指南"
        moreLink="/more/1"
        title="热销榜">
      <ul class="hot-ul">
        <li :key="item.id"
            @click="showGood(item.id)"
            class="sale-item"
            v-for="item in hotGoods">
          <img :src="item.imageUrl"
              alt="">
          <div class="sale-title">
            <span class="sale-name">{{item.name}}</span>
            <span class="sale-price">￥{{item.salePrice}}</span>
          </div>
        </li>
      </ul>
    </good-item>
    <good-item describe="前所未有的折扣"
        moreLink="/more/1"
        title="低价促销">
      <ul class="sale-ul">
        <li :key="item.id"
            @click="showGood(item.id)"
            class="li-item"
            v-for="(item) in saleGoods">
          <div class="img">
            <img :src="item.imageUrl">
          </div>
          <div class="title">
            {{item.name}}
          </div>
          <div class="price">
            <span class="new-price">
              ￥{{item.salePrice}}
            </span>
            <span class="old-price">
          <del>
            ￥{{item.price}}
          </del>
        </span>
          </div>
        </li>
      </ul>
    </good-item>
    <good-item describe="发现更多优质好货"
        title="发现">
      <ul class="discover-ul">
        <background-img :class="index===0?'discover-img':''"
            :desc="item.description"
            :imgSrc="item.imageUrl"
            :key="item.id"
            :topic="item.name"
            @click.native="showGood(item.id)"
            class="discover-li"
            v-for="(item,index) in discoverGoods.slice(0,2)"></background-img>
      </ul>
      <ul class="discover-ul">
        <background-img :desc="item.description"
            :imgSrc="item.imageUrl"
            :key="item.id"
            :topic="item.name"
            @click.native="showGood(item.id)"
            class="discover-li"
            v-for="item in discoverGoods.slice(2,5)"></background-img>
      </ul>
    </good-item>
    <div class="recommend">
      <div class="recommend-title">
        <div class="border"></div>
        <div class="title">精选分类</div>
        <div class="border"></div>
      </div>
      <van-tabs>
        <van-tab :key="item.id"
            :title="item.title"
            v-for="item in classifyGoods">
          <tabItem :data="item.data" @showGood="showGood"></tabItem>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import {handleServerError} from "../../utils/utils";

  import goodItem from "~/components/goodItem";
  import backgroundImg from "~/components/backgroundImg";
  import tabItem from "~/components/tabItem";

  const baseUrl = "http://127.0.0.1";

  export default {
    async asyncData({$axios, error, redirect}) {
      try {
        let data = await $axios.$post("/getPublicKey");
        let promiseArr = [
          $axios.$post("/book/getHotGood"),
          $axios.$post("/book/getSaleGood"),
          $axios.$post("/book/getDiscoverGood"),
          $axios.$post("/book/getRandClassify")
        ];
        let [hotData, saleData, discoverData, classifyGood] = await Promise.all(promiseArr);
        if (hotData.errorCode === 200
          && saleData.errorCode === 200
          && discoverData.errorCode === 200
          && classifyGood.errorCode === 200) {
          return {
            hotGoods: hotData.data,
            saleGoods: saleData.data,
            discoverGoods: discoverData.data,
            classifyGoods: classifyGood.data
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
        searchValue: "",
        indexPage: 1,
        images: [
          {id: 1, url: baseUrl + "/images/shop/swipe/swipe-1.jpg"},
          {id: 2, url: baseUrl + "/images/shop/swipe/swipe-2.jpg"},
          {id: 3, url: baseUrl + "/images/shop/swipe/swipe-3.jpg"},
          {id: 4, url: baseUrl + "/images/shop/swipe/swipe-4.jpg"}
        ]
      };
    },
    mounted() {
    },
    computed: {
      goodItems() {
        return {};
      }
    },
    methods: {
      showGood(bookId) {
        console.log(bookId);
      },
      // 搜索
      onSearch() {
        console.log("onSearch");
      },
      // 轮播图index
      changeSwipe(index) {
        this.indexPage = index;
      },
      // 轮播图跳转
      linkSwipe(id) {
        console.log(id);
      }
    },
    components: {
      goodItem,
      backgroundImg,
      tabItem
    }
  };
</script>

<style lang="stylus"
    scoped>
  .home {
    background-color #eee
    margin-bottom 50px

    .van-search {
      border-bottom 1px solid #dedede
    }
  }

  .home-swipe {
    box-sizing border-box
    padding 4px 6px
    background-color #fff
    border-bottom 1px solid #dedede

    .home-swipe-head {
      padding 4px 0

      .recommend {
        font-weight 700
      }

      .tips {
        font-size 12px
        margin-left 6px
        color #8f8f8f
      }

      .swipe-num {
        float right

        .indexPage {
          font-weight 700
        }

        .pageNum {
          font-size 12px
          color #8f8f8f
        }
      }
    }

    .van-swipe {
      height 136px

      img {
        width 100%
      }
    }
  }

  .hot-ul {
    display flex

    .sale-item {
      flex-grow 1
      width 25%
      overflow hidden
      padding 2px 4px

      img {
        height 100px
      }

      .sale-title {
        text-align center
        font-size 14px

        .sale-price {
          color #ff4c0a
          font-size 16px
        }
      }
    }
  }

  .sale-ul {
    display flex
    margin-bottom 4px

    .li-item {
      flex-grow 1
      width 25%
      overflow hidden
      padding 2px 4px

      img {
        height 100px
      }

      .title {
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      }

      .new-price {
        color #ff4c0a
      }

      .old-price {
        font-size 12px
        color #333
        margin-left 6px
      }
    }
  }

  .discover-ul {
    display flex
    height 100px
    margin-bottom 4px

    .discover-img {
      width 100px
    }

    .discover-li {
      flex-grow 1
      margin-right 4px

      &:last-child {
        margin-right 0
      }
    }
  }

  .recommend-title {
    display flex
    justify-content center
    align-items center
    text-align center
    font-size 14px
    height 30px

    .border {
      width 12px
      height 1px
      margin 0 8px
      background-color #000
    }
  }
</style>
