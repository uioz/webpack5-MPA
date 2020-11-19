<template>
  <div class="helloworld">
    {{ message }}
    <img src="/static/bad.png" alt="" />
  </div>
</template>
<script>
export default {
  name: "index",
  data() {
    return {
      message: "hello world",
    };
  },
};
</script>
<style lang="scss">
@import "../../assets/main.scss";
</style>
