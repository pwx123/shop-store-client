<template>
  <div>
    <van-nav-bar
        @click-left="$router.go(-1)"
        left-arrow
        left-text="返回"
        title="收货地址"
    />
    <van-address-list
        :list="addressList"
        @add="addAddress"
        @edit="editAddress"
        @select="selectAddress"
        v-model="defaultAddress"
    />
  </div>

</template>

<script>
  import {handleServerError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect, route}) {
      try {
        let res = await $axios.$post("/address/getAddressList");
        let defaultAddress = "";
        if (res.errorCode === 200) {
          let data = res.data;
          for (let i = 0, len = data.length; i < len; i++) {
            let obj = res.data[i];
            obj.address = obj.provinceName + obj.cityName + obj.countryName + obj.detailAddress;
            if (obj.isDefault) {
              defaultAddress = obj.id;
            }
          }
          return {
            addressList: data,
            defaultAddress
          };
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    },
    mounted() {
      let selectAddress = localStorage.getItem("selectAddress");
      if (selectAddress) {
        let address = JSON.parse(selectAddress);
        this.defaultAddress = address.id;
      }
    },
    methods: {
      selectAddress(item, id) {
        localStorage.setItem("isSettlement", "false");
        localStorage.setItem("selectAddress", JSON.stringify(item));
      },
      addAddress() {
        this.$router.push({
          path: "/address/deal",
          query: {
            type: 0
          }
        });
      },
      editAddress(item) {
        this.$router.push({
          path: "/address/deal",
          query: {
            type: 1,
            id: item.id
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
