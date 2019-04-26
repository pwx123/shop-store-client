<template>
  <div class="address">
    <van-nav-bar :title="type == 1 ? '编辑收货地址' : '新增收货地址'"
        :z-index="10"
        @click-left="$router.go(-1)"
        fixed
        left-arrow
        left-text="返回"></van-nav-bar>
    <van-cell-group>
      <van-field
          :error-message="areaInfoErr.nameErr"
          clearable
          label="姓名"
          placeholder="请输入收货人信息"
          v-model="areaInfo.deliveryName"
      />
      <van-field
          :error-message="areaInfoErr.mobileErr"
          clearable
          label="电话"
          maxlength="11"
          placeholder="请输入收货人手机号"
          v-model="areaInfo.deliveryMobile"
      />
      <van-field
          :error-message="areaInfoErr.areaErr"
          @click="showSelectArea"
          clearable
          label="地区"
          placeholder="选择省 / 市 / 区"
          readonly
          v-model="selectArea"
      />
      <van-field
          :error-message="areaInfoErr.detailErr"
          clearable
          label="详细地址"
          placeholder="街道门牌、楼层房间号等信息"
          v-model="areaInfo.detailAddress"
      />
      <van-switch-cell title="设为默认地址" v-model="areaInfo.isDefault"/>
    </van-cell-group>
    <div class="btn-group">
      <van-button @click="saveAreaInfo" type="danger">保存</van-button>
      <van-button @click="deleteAreaInfo" v-if="type == 1">删除</van-button>
    </div>
    <van-popup
        position="bottom"
        v-model="selectShow"
    >
      <div class="title">
        <span @click="cancelSelect">取消</span>
        <span @click="submitSelect">确认</span>
      </div>
      <div class="picker">
        <van-picker
            :columns="provinceInfo.value"
            @change="provinceChange"
            ref="province"
        />
        <van-picker
            :columns="cityInfo.value"
            @change="cityChange"
            ref="city"
        />
        <van-picker
            :columns="countryInfo.value"
            ref="country"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {handleServerError, handleError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect, query}) {
      try {
        let defaultArea = {
          provinceId: "110000000000",
          cityId: "110100000000",
        };
        let resObj = {};
        if (query.type == 1) {
          let res = await $axios.$post("/address/getAddressById", {id: query.id});
          if (res.errorCode === 200) {
            defaultArea.provinceId = res.data.provinceId;
            defaultArea.cityId = res.data.cityId;
            res.data.isDefault = res.data.isDefault === 1 ? true : false;
            resObj.areaInfo = res.data;
          } else {
            handleServerError("", error, redirect);
            return false;
          }
        }
        let promiseArr = [
          $axios.$post("/getProvince"),
          $axios.$post("/getCityByProvince", {
            provinceId: defaultArea.provinceId
          }),
          $axios.$post("/getCountryByCity", {
            cityId: defaultArea.cityId
          })
        ];
        let [provinceArr, cityArr, countryArr] = await Promise.all(promiseArr);
        if (provinceArr.errorCode === 200
          && cityArr.errorCode === 200
          && countryArr.errorCode === 200) {
          let provinceInfo = {};
          let cityInfo = {};
          let countryInfo = {};
          provinceInfo.value = provinceArr.data.map(item => item.name);
          provinceInfo.key = provinceArr.data.map(item => item.provinceId);
          cityInfo.value = cityArr.data.map(item => item.name);
          cityInfo.key = cityArr.data.map(item => item.cityId);
          countryInfo.value = countryArr.data.map(item => item.name);
          countryInfo.key = countryArr.data.map(item => item.countryId);
          resObj.provinceInfo = provinceInfo || {};
          resObj.cityInfo = cityInfo || {};
          resObj.countryInfo = countryInfo || {};
          return resObj;
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    },
    data() {
      return {
        areaInfo: {
          deliveryName: "",
          deliveryMobile: "",
          provinceName: "",
          provinceId: "",
          cityName: "",
          cityId: "",
          countryName: "",
          countryId: "",
          detailAddress: "",
          isDefault: false
        },
        areaInfoErr: {
          nameErr: "",
          mobileErr: "",
          areaErr: "",
          detailErr: ""
        },
        type: this.$route.query.type,
        selectShow: false
      };
    },
    computed: {
      selectOver() {
        return this.areaInfo.provinceId && this.areaInfo.cityId && this.areaInfo.countryId;
      },
      selectArea() {
        return this.selectOver ? this.areaInfo.provinceName + " / " + this.areaInfo.cityName + " / " + this.areaInfo.countryName : "";
      }
    },
    mounted() {
    },
    methods: {
      // 省份改变
      async provinceChange(item, value, index) {
        try {
          let provinceId = this.provinceInfo.key[index];
          let res = await this.$axios.$post("/getCityByProvince", {
            provinceId
          });
          if (res.errorCode === 200) {
            this.cityInfo.value = res.data.map(item => item.name);
            this.cityInfo.key = res.data.map(item => item.cityId);
            this.cityChange(1, 1, 0);
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 市改变
      async cityChange(item, value, index) {
        try {
          let cityId = this.cityInfo.key[index];
          let res = await this.$axios.$post("/getCountryByCity", {
            cityId
          });
          if (res.errorCode === 200) {
            this.countryInfo.value = res.data.map(item => item.name);
            this.countryInfo.key = res.data.map(item => item.countryId);
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 保存收货地址
      async saveAreaInfo() {
        this.areaInfoErr = {
          nameErr: "",
          mobileErr: "",
          areaErr: "",
          detailErr: ""
        };
        if (!this.areaInfo.deliveryName) {
          this.areaInfoErr.nameErr = "请输入收货人姓名";
          return false;
        }
        if (!this.areaInfo.deliveryMobile) {
          this.areaInfoErr.mobileErr = "请输入收货人手机号";
          return false;
        }
        if (!this.selectOver) {
          this.areaInfoErr.areaErr = "请选择 省 / 市 / 区 信息";
          return false;
        }
        if (!this.areaInfo.detailAddress) {
          this.areaInfoErr.detailErr = "请输入详细地址";
          return false;
        }
        try {
          let url = "/address/addAddress";
          let msg = "添加成功";
          if (this.type == 1) {
            url = "/address/updateAddress";
            msg = "修改成功";
            this.areaInfo.id = this.$route.query.id;
          }
          let res = await this.$axios.$post(url, this.areaInfo);
          if (res.errorCode === 200) {
            this.$notify({
              message: msg,
              duration: 1000,
              background: "#1989fa"
            });
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else {
            this.$notify({
              message: res.errorMsg
            });
          }
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 删除收货地址
      deleteAreaInfo() {
        try {
          this.$dialog.confirm({
            title: "提示",
            message: "确定删除该收货地址吗？"
          }).then(async () => {
            let res = await this.$axios.$post("/address/deleteAddress", {id: this.$route.query.id});
            if (res.errorCode === 200) {
              this.$notify({
                message: "删除成功",
                duration: 1000,
                background: "#1989fa"
              });
              let selectAddress = localStorage.getItem("selectAddress");
              if (selectAddress) {
                let address = JSON.parse(selectAddress);
                if (address.id == this.$route.query.id) {
                  localStorage.removeItem("selectAddress");
                }
              }
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            } else {
              this.$notify({
                message: res.errorMsg
              });
            }
          }).catch(() => {
          });
        } catch (err) {
          handleError(err, this.$router);
        }
      },
      // 展示地址选择
      showSelectArea() {
        this.selectShow = true;
        this.$nextTick(() => {
          if (this.type == 1) {
            this.$refs.province.setValues([this.areaInfo.provinceName]);
            this.$refs.city.setValues([this.areaInfo.cityName]);
            this.$refs.country.setValues([this.areaInfo.countryName]);
          }
        });
      },
      // 取消地址选择
      cancelSelect() {
        this.selectShow = false;
      },
      // 确认地址选择
      submitSelect() {
        let provinceRef = this.$refs.province;
        let cityRef = this.$refs.city;
        let countryRef = this.$refs.country;
        this.areaInfo.provinceName = this.provinceInfo.value[provinceRef.getIndexes()];
        this.areaInfo.provinceId = this.provinceInfo.key[provinceRef.getIndexes()];
        this.areaInfo.cityName = this.cityInfo.value[cityRef.getIndexes()];
        this.areaInfo.cityId = this.cityInfo.key[cityRef.getIndexes()];
        this.areaInfo.countryName = this.countryInfo.value[countryRef.getIndexes()];
        this.areaInfo.countryId = this.countryInfo.key[countryRef.getIndexes()];
        this.selectShow = false;
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .address {
    padding-top 46px
    background-color #f2f3f5
    height 100vh

    .btn-group {
      padding 20px

      .van-button {
        width 100%
        margin-bottom 20px
      }
    }
  }

  .van-popup {
    .title {
      display flex
      height 44px
      line-height 44px
      justify-content space-between
      border-bottom 1px solid #f2f3f5

      > span {
        color #1989fa
        padding 0 15px
        font-size 14px
      }
    }

    .picker {
      display flex

      .van-picker {
        flex 1
      }
    }
  }
</style>
