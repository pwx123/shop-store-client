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
        :switchable="false"
        @add="addAddress"
        @edit="editAddress"
    >
    </van-address-list>
  </div>

</template>

<script>
  import {handleServerError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect, route}) {
      try {
        let res = await $axios.$post("/address/getAddressList");
        if (res.errorCode === 200) {
          let data = res.data;
          for (let i = 0, len = data.length; i < len; i++) {
            let obj = res.data[i];
            obj.address = obj.provinceName + obj.cityName + obj.countryName + obj.detailAddress;
          }
          return {
            addressList: data
          };
        } else {
          handleServerError("", error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    },
    mounted() {
    },
    methods: {
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

<style lang="stylus" scoped>

</style>
