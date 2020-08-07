<template>
  <div class="hello">
    <img :src="logo" />
    <h1>欢迎使用{{name}}</h1>
  </div>
</template>

<script>
import system from '../config/system'
export default {
  data() {
    return {
      logo: require('@/assets/images/poros.png'),
      name: system.name
    }
  }
}
</script>

<style lang="less" scoped>
.hello {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20vh;
  >h1 {
    font-size: 25px;
  }
}
</style>