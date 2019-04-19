<template>
  <div>
    {{name}}
  </div>
</template>

<script>
  import {handleServerError} from "../../utils/utils";

  export default {
    async asyncData({$axios, error, redirect}) {
      try {
        let data = await $axios.$post("/getPublicKey");
        if (data.errorCode === 200) {
          return {name: 123};
        } else {
          handleServerError(data.errorMsg, error, redirect);
        }
      } catch (err) {
        handleServerError(err, error, redirect);
      }
    },
    data() {
      return {
        activeNav: 0
      };
    },
    mounted() {
      this.start();
    },
    methods: {
      async start() {
        let data = await this.$axios.$post("/getPublicKey");
      }
    }
  };
</script>

<style lang="stylus">

</style>
