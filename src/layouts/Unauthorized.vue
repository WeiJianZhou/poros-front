<template>
  <p-layout>
    <p-layout-content>
      <router-view />
    </p-layout-content>
    <p-layout-footer class="copyright">
      Copyright &copy; {{copyright}}
    </p-layout-footer>
  </p-layout>  
</template>

<script>
import system from '@/config/system'
export default {
  computed: {
    copyright() {
      return system.name
    }
  }
}
</script>

<style lang="less" scoped>
.copyright {
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
}
</style>