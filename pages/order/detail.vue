<template>
  <div class="order-detail">
    <van-nav-bar :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"
        title="订单详情"></van-nav-bar>
    <van-panel>
      <div class="order-header" slot="header">
          <span
              :style="'color: ' + (statusMap[orderDetail.status] ? statusMap[orderDetail.status].color : '') ">{{statusMap[orderDetail.status] ? statusMap[orderDetail.status].val : "--"}}</span>
      </div>
      <van-card
          :key="order.bookId"
          :num="order.bookNum"
          :origin-price="formatPrice(order.bookPrice)"
          :price="formatPrice(order.bookSalePrice)"
          :thumb="order.bookImageUrl"
          :title="order.bookName"
          v-for="order in orderDetail.orders">
        <div class="desc" slot="desc">
          {{order.bookTitle.length > 32 ? order.bookTitle.slice(0,32) + "..." : order.bookTitle}}
        </div>
      </van-card>
      <div class="order-footer" slot="footer">
        <van-button @click="payStatusClick(orderDetail)"
            size="small"
            v-if="payStatusFun(orderDetail.status)">去支付
        </van-button>
        <van-button @click="deliveryStatusClick(orderDetail)"
            size="small"
            v-if="deliveryStatusFun(orderDetail.status)">查看物流
        </van-button>
        <van-button @click="refundStatusClick(orderDetail)"
            size="small"
            v-if="refundStatusFun(orderDetail.status)">我要退款
        </van-button>
        <van-button @click="submitStatusClick(orderDetail)"
            size="small"
            v-if="submitStatusFun(orderDetail.status)">确认收货
        </van-button>
      </div>
    </van-panel>
    <div class="price">
      <p>
        <span>商品总价</span>
        <span>{{orderDetail.orderMoney | money}}</span>
      </p>
      <p>
        <span>运费</span>
        <span>{{orderDetail.deliveryMoney | money}}</span>
      </p>
      <p>
        <span>订单总价</span>
        <span>{{orderDetail.totalMoney | money}}</span>
      </p>
    </div>
    <div class="order-info">
      <p class="title">订单信息</p>
      <div class="info">
        <p class="line">
          <span>订单号:</span>
          <span>{{orderDetail.orderId || "--"}}</span>
        </p>
        <p class="line">
          <span>创建时间:</span>
          <span>{{orderDetail.createdAt || "--"}}</span>
        </p>
        <p class="line">
          <span>付款时间:</span>
          <span>{{orderDetail.dealAt || "--"}}</span>
        </p>
        <p class="line">
          <span>发货时间:</span>
          <span>{{orderDetail.deliveryAt || "--"}}</span>
        </p>
      </div>
    </div>
    <van-dialog
        :before-close="dialogBeforeClose"
        @cancel="showDialog = false"
        show-cancel-button
        title="提示"
        v-model="showDialog"
    >
      <van-cell-group>
        <van-field
            :error-message="dialogErr"
            label="退款原因"
            maxlength="50"
            placeholder="请输入退款原因"
            rows="2"
            type="textarea"
            v-model="remark"
        />
      </van-cell-group>
    </van-dialog>
    <van-dialog
        title="物流信息"
        v-model="showDeliveryDialog"
    >
      <van-steps :active="0" direction="vertical">
        <van-step :key="index" v-for="(item,index) in deliveryInfo">
          <p>{{item.info}}</p>
          <p>{{item.time}}</p>
        </van-step>
      </van-steps>
    </van-dialog>
  </div>
</template>

<script>
  import {handleServerError, handleError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect, query}) {
      try {
        if (!query.id) {
          redirect("/");
        }
        let res = await $axios.$post("/order/getOrderDetailById", {id: query.id});
        if (res.errorCode === 200) {
          return {
            orderDetail: res.data || {}
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
        remark: "",
        refundId: "",
        payStatus: [0],
        deliveryStatus: [3, 4],
        refundStatus: [1, 2, 3, 4, 5],
        submitStatus: [3, 4],
        total: 0,
        showDeliveryDialog: false,
        deliveryInfo: [],
        dialogErr: "",
        showDialog: false,
        statusAll: [
          {
            value: 0,
            label: "待支付",
            color: "#0099cc"
          },
          {
            value: 1,
            label: "待确认",
            color: "#f56c6c"
          },
          {
            value: 2,
            label: "待发货",
            color: "#ff9966"
          },
          {
            value: 3,
            label: "已发货",
            color: "#0099cc"
          },
          {
            value: 4,
            label: "待收货",
            color: "#3366cc"
          },
          {
            value: 5,
            label: "已完成",
            color: "#67c23a"
          },
          {
            value: 6,
            label: "退款处理中",
            color: "#cc9966"
          },
          {
            value: 7,
            label: "退款完成",
            color: "#25C6FC"
          },
          {
            value: 8,
            label: "拒绝退款",
            color: "#909399"
          },
          {
            value: 9,
            label: "订单超时",
            color: "#909399"
          },
          {
            value: 10,
            label: "已删除",
            color: "#909399"
          }
        ],
      };
    },
    computed: {
      statusMap() {
        let obj = {};
        for (let i = 0, len = this.statusAll.length; i < len; i++) {
          obj[this.statusAll[i].value] = {};
          obj[this.statusAll[i].value].val = this.statusAll[i].label;
          obj[this.statusAll[i].value].color = this.statusAll[i].color;
        }
        return obj;
      },
    },
    methods: {
      async getOrderDetail(){
        try {
          let res = await this.$axios.$post("/order/getOrderDetailById", {id: this.$route.query.id});
          if (res.errorCode === 200) {
            this.orderDetail = res.data;
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 去支付
      payStatusClick(item) {
        this.$router.push({
          path: "/safe/validPayPwd",
          query: {
            orderId: item.orderId
          }
        });
      },
      // 填写退款备注
      refundStatusClick(item) {
        this.remark = "";
        this.showDialog = true;
        this.refundId = item.id;
        this.dialogErr = "";
      },
      dialogBeforeClose(action, done) {
        if (this.remark) {
          this.submitRefund();
          done();
        } else {
          this.dialogErr = "请输入退款原因";
          done(false);
        }
      },
      // 退款
      async submitRefund() {
        try {
          let res = await this.$axios.$post("/order/submitRefundOrder", {
            id: this.refundId,
            remark: this.remark
          });
          if (res.errorCode === 200) {
            this.getOrderDetail();
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 查看物流信息
      async deliveryStatusClick(item) {
        try {
          let res = await this.$axios.$post("/getDeliveryInfoById", {
            id: item.deliveryId
          });
          if (res.errorCode === 200) {
            this.deliveryInfo = res.data.infoArr;
            this.showDeliveryDialog = true;
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 确认收货
      async submitStatusClick(item) {
        try {
          let res = await this.$axios.$post("/order/submitOrderComplete", {
            id: item.id
          });
          if (res.errorCode === 200) {
            this.$notify({
              message: "确认收货成功",
              background: "#1989fa"
            });
            this.getOrderDetail();
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      payStatusFun(status) {
        return this.payStatus.indexOf(status) !== -1;
      },
      deliveryStatusFun(status) {
        return this.deliveryStatus.indexOf(status) !== -1;
      },
      refundStatusFun(status) {
        return this.refundStatus.indexOf(status) !== -1;
      },
      submitStatusFun(status) {
        return this.submitStatus.indexOf(status) !== -1;
      },
      formatPrice(price) {
        return price.toFixed(2);
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .order-detail {
    padding-top 46px
    background-color #eee
    min-height 100vh
  }

  .order-header {
    display flex
    justify-content space-between
    padding 10px 16px
    font-size 14px
    border-bottom 1px solid #eee
  }

  .order-footer {
    text-align right
  }

  .price {
    p {
      display flex
      justify-content space-between
      background-color #fff
      padding 6px 10px
      font-size 14px

      span:first-child {
        color #666
      }

      span:last-child {
        color #f44
      }
    }
  }

  .order-info {
    margin-top 6px
    padding 10px
    background-color #fff

    .title {
      font-size 14px
      padding-left 10px
      color #666
      border-left 2px solid #f44
    }

    .info {
      margin-top 10px
    }

    .line {
      display flex
      justify-content space-between
      background-color #fff
      padding 6px 10px
      font-size 14px

      span:first-child {
        max-width 200px
        color #666
      }
    }
  }
</style>
