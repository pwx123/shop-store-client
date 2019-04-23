<template>
  <div class="search">
    <van-search @search="onSearch"
        placeholder="请输入搜索关键词"
        show-action
        v-model="searchValue">
      <div @click="onSearch"
          slot="action">搜索
      </div>
    </van-search>
    <tab-item :data="searchData" @showGood="showGood" v-if="searchData.length"></tab-item>
    <div class="no-result" v-else="">
      暂无结果 ~~
    </div>
  </div>
</template>

<script>

  import tabItem from "../../components/tabItem";
  import {handleError} from "../../utils/utils";

  export default {
    data() {
      return {
        searchValue: "",
        searchData: []
      };
    },
    mounted() {
      this.getSearchData(1);
    },
    methods: {
      async getSearchData(isInit) {
        if (isInit) {
          this.searchValue = localStorage.getItem("search");
        }
        try {
          let res = await this.$axios.$post("/book/searchBook", {search: this.searchValue});
          if (res.errorCode === 200) {
            this.searchData = res.data;
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 跳转商品详情
      showGood(id) {
        this.$router.push({
          path: "/good/detail",
          query: {
            id
          }
        });
      },
      onSearch() {
        localStorage.setItem("search", this.searchValue);
        if (this.searchValue === '') {
          this.searchData = [];
          return false;
        }
        this.getSearchData();
      }
    },
    components: {
      tabItem
    }
  };
</script>
<style lang="stylus" scoped>
  .search {
    background-color #eee
    min-height 100vh

    .no-result {
      text-align center
      font-size 14px
      color #666
      margin-top 10px
    }
  }
</style>
