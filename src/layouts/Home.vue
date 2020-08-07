<template>
  <p-layout class="home">
    <p-sider-menu :collapsed="collapsed" />
    <p-layout>
      <p-layout-header>
        <p-icon class="home__trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
        <p-sys-nav style="flex: 1;"/>
        <div class="home__help" @click="helper">
          <p-icon class="home__help-icon" type="question-circle" theme="filled" />
          <span>帮助</span>
        </div>
        <p-dropdown>
          <div class="home__user">
            <p-avatar class="home__avatar" v-if="avatar" :src="avatar" :size="18" />
            <svg-icon class="home__admin" type="admin" v-else />
            <span>{{username}}</span>
          </div>
          <p-menu slot="overlay" style="width: 130px;text-align:center;" @click="handler">
            <p-menu-item key="goAuth">
              <a target="_self" rel="noopener noreferrer" href="/auth">返回门户</a>
            </p-menu-item>
            <p-menu-item key="updatePwd">
              <a target="_self" rel="noopener noreferrer" href="/auth/updatepwd">修改密码</a>
            </p-menu-item>
            <p-menu-divider />
            <p-menu-item key="logout">退出</p-menu-item>
          </p-menu>
        </p-dropdown>
      </p-layout-header>
      <p-layout-content style="overflow: auto;">
        <p-router-tabs scroll/>
      </p-layout-content>
    </p-layout>
  </p-layout>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      collapsed: false
    }
  },
  computed: {
    avatar() {
      return this.$store.state.user.avatar
    },
    username() {
      return this.$store.state.user.name
    }
  },
  methods: {
    handler({ key }) {
      switch(key) {
        case 'logout':
          this.logout()
          break
      }
    },
    helper() {
      this.$message.warning('未定义业务跳转地址')
    },
    logout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗?',
        onOk: () => {
          this.$store.dispatch('logout')
        },
        onCancel() {}
      })
    }
  },
  mounted() {
    // 获取登录用户信息
    this.$store.dispatch('requireUserInfo')
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  min-width: 1280px;
}

.home__trigger {
  font-size: 20px;
  padding: 0 14px;
  cursor: pointer;
  transition: color .3s;
  outline: none;
}
.home__help {
  display: flex;
  align-items: center;
  padding-right: 12px;
  cursor: pointer;
}
.home__help-icon {
  font-size: 18px;
  color: @primary-color;
  margin-right: 10px;
}
.home__user {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.home__avatar {
  margin-right: 10px;
}
.home__admin {
  font-size: 18px;
  color: @primary-color;
}
</style>