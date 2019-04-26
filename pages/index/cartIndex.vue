<template>
  <div class="cart">
    <van-nav-bar :right-text="rightText"
        :z-index="10"
        @click-right="editCart"
        fixed
        title="购物车"/>
    <div class="no-good"
        v-if="!this.cartList.length">
      <div>购物车空空的，快去购物吧~</div>
      <van-button class="btn"
          to="/"
          type="primary">去首页
      </van-button>
    </div>
    <van-checkbox-group
        v-model="checkedGood">
      <div class="check-item" v-for="item in cartList">
        <van-checkbox :key="item.id"
            :name="item.id">
        </van-checkbox>
        <van-card
            :num="item.count"
            :origin-price="formatPrice(item.price)"
            :price="formatPrice(item.salePrice)"
            :thumb="item.imageUrl"
            :title="item.name">
          <div class="desc" slot="desc">
            {{item.description.length > 32 ? item.description.slice(0,32) + "..." : item.description}}
          </div>
          <div class="footer"
              slot="footer">
            <span @click="addCount(item,item.count)">
              <van-button size="mini">+</van-button>
            </span>
            <span @click="showModal(item)"
                class="input">
              <span class="input-edit">{{item.count}}</span>
            </span>
            <span @click="reduceCount(item,item.count)">
              <van-button size="mini">-</van-button>
            </span>
          </div>
        </van-card>
      </div>
    </van-checkbox-group>
    <van-dialog :before-close="beforeClose"
        show-cancel-button
        title="数量修改"
        v-model="modalShow">
      <div class="modal-box">
        <span @click="reduceEditCount">
          <van-button size="mini">-</van-button>
        </span>
        <span class="input">
          <input type="number"
              v-model.number="editNum"/>
        </span>
        <span @click="addEditCount">
          <van-button size="mini">+</van-button>
        </span>
      </div>
    </van-dialog>
    <van-submit-bar :button-text="isEdit ? '删除' : '提交订单'"
        :label="isEdit ? '' : '合计'"
        :price="isEdit ? undefined : totalPrice * 100"
        @submit="onSubmit"
        v-if="this.cartList.length">
      <span class="selectAll">
        <van-checkbox v-model="checkedAll">
          {{this.checkedAll ? "全不选":"全选"}}
        </van-checkbox>
      </span>
    </van-submit-bar>
    <loading :loading="loading"></loading>
  </div>
</template>
<script>
  import {Toast} from "vant";
  import Loading from "../../components/loading";
  import {handleError} from "../../utils/utils";

  export default {
    components: {Loading},
    data() {
      return {
        cartList: [],
        checkedGood: [],
        isEdit: false,
        modalShow: false,
        editGood: {},
        editNum: 0,
        loading: true
      };
    },
    computed: {
      rightText() {
        if (this.cartList.length) {
          return this.isEdit ? "完成" : "编辑";
        } else {
          return "";
        }
      },
      totalPrice() {
        return this.cartList.reduce((t, c) => {
          return t + (this.checkedGood.indexOf(c.id) !== -1 ? c.salePrice * c.count : 0);
        }, 0);
      },
      checkedAll: {
        get() {
          return this.cartList.length ? this.cartList.length === this.checkedGood.length : false;
        },
        set(val) {
          if (val) {
            this.checkedGood = this.cartList.map(item => item.id);
          } else {
            this.checkedGood = [];
          }
        }
      }
    },
    mounted() {
      this.getCartList();
    },
    methods: {
      // 获取购物车列表
      async getCartList() {
        try {
          let res = await this.$axios.$post("/cart/getUserCartList");
          this.loading = false;
          if (res.errorCode === 200) {
            this.cartList = res.data;
            this.checkedGood = [];
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          this.loading = false;
          handleError(err, this.$router);
        }
      },
      // 更新购物车数量
      updateCartCountThrottle(id, count) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.updateCartCount(id, count);
        }, 500);
      },
      async updateCartCount(id, count) {
        try {
          let res = await this.$axios.$post("/cart/updateCartCount", {id, count});
          if (res.errorCode === 200) {
            this.getCartList();
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 编辑购物车或完成删除
      editCart() {
        this.isEdit = !this.isEdit;
      },
      // 提交或确定删除
      async onSubmit() {
        if (!this.checkedGood.length) {
          this.$notify({
            message: "请选择要操作的商品"
          });
          return false;
        }
        if (this.isEdit) {
          try {
            let res = await this.$axios.$post("/cart/deleteCart", {ids: this.checkedGood.join(",")});
            if (res.errorCode === 200) {
              this.getCartList();
              this.$notify({
                message: "删除成功",
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
        } else {
          localStorage.setItem("settlementList", JSON.stringify(this.checkedGood));
          localStorage.setItem("isSettlement", "true");
          localStorage.removeItem("selectAddress");
          this.$router.push("/cart/settlement");
        }
      },
      reduceCount(good, count) {
        if (!count && count !== 0) {
          Toast({
            position: "bottom",
            message: "数值不正确~"
          });
          return;
        }
        if (count <= 1) {
          Toast({
            position: "bottom",
            message: "不能再少了~"
          });
          return;
        }
        count--;
        good.count = count;
        this.updateCartCountThrottle(good.id, count);
      },
      addCount(good, count) {
        if (!count && count !== 0) {
          Toast({
            position: "bottom",
            message: "数值不正确~"
          });
          return;
        }
        if (count >= 10) {
          Toast({
            position: "bottom",
            message: "限购10本~"
          });
          return;
        }
        count++;
        good.count = count;
        this.updateCartCountThrottle(good.id, count);
      },
      reduceEditCount() {
        if (!this.editNum && this.editNum !== 0) {
          Toast({
            position: "bottom",
            message: "数值不正确~"
          });
          return;
        }
        if (this.editNum <= 1) {
          Toast({
            position: "bottom",
            message: "不能再少了~"
          });
          return;
        }
        this.editNum--;
      },
      addEditCount() {
        if (!this.editNum && this.editNum !== 0) {
          Toast({
            position: "bottom",
            message: "数值不正确~"
          });
          return;
        }
        if (this.editNum >= 10) {
          Toast({
            position: "bottom",
            message: "限购10本~"
          });
          return;
        }
        this.editNum++;
      },
      formatPrice(price) {
        return price.toFixed(2);
      },
      showModal(item) {
        this.modalShow = true;
        this.editGood = item;
        this.editNum = item.count;
      },
      beforeClose(action, done) {
        if (action === "confirm") {
          if (!this.editNum) {
            Toast({
              position: "bottom",
              message: "数值不正确~"
            });
            done(false);
            return;
          }
          if (this.editNum >= 10) {
            Toast({
              position: "bottom",
              message: "限购10本"
            });
            done(false);
            return;
          }
          if (this.editNum < 1) {
            Toast({
              position: "bottom",
              message: "数量太少了~"
            });
            done(false);
            return;
          }
          this.editGood.count = this.editNum;
          this.updateCartCountThrottle(this.editGood.id, this.editNum);
          done();
        } else {
          done();
        }
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .cart {
    height 100%
    margin-bottom 120px
  }

  .no-good {
    position absolute
    width 220px
    text-align center
    color #666
    left 50%
    top 50%
    transform translate(-50%, -50%)

    .btn {
      margin-top 16px
    }
  }

  .van-checkbox-group {
    padding-top 46px
    padding-bottom 0
    background-color #fff

    .check-item {
      position relative
      background-color #fafafa

      .van-checkbox {
        position absolute
        top 50%
        left 10px
        transform translateY(-50%)
      }

      .van-card {
        margin-left 30px
      }
    }
  }

  .desc {
    color #7d7e80
    margin 6px 0
    min-height 30px
    overflow hidden
  }

  .footer, .modal-box {
    display flex
    flex-direction row-reverse
    align-items center
    margin-bottom 6px

    &.modal-box {
      flex-direction row
      justify-content center
    }

    input {
      outline 0
      border 0
      width 50px
      text-align center
      border-bottom 1px solid #f6b539
      margin 0 6px
    }

    .van-button {
      min-width 30px
      margin 0
    }

    .input .input-edit {
      padding 0 10px
      font-size 14px
      text-align center
      background-color #fafafa
      border-bottom 1px solid #f6b539
      margin 0 6px
    }
  }

  .van-submit-bar {
    bottom 50px

    .selectAll {
      margin-left 14px
    }
  }
</style>
