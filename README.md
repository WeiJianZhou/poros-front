<center><font size="6">poros-project</font></center>

# 介绍
​	由poros-cli创建的项目，在vue项目的基础上，引入了poros插件，集成主题配置以及登录功能，并提供布局和模板。

# 目录

```
root ----------------------------- 根目录
|-- public ----------------------- 静态资源
   |-- favicon.ico --------------- 网站ico
   |-- index,html ---------------- 主页
|-- src -------------------------- 源码目录
    |-- assets ------------------- 资源
    |-- images ------------------- 图片资源
    |-- svgs --------------------- svg资源
    |-- components --------------- 自定义组件库
        |-- svg-icon ------------- svg图标组件
    |-- configs ------------------ 配置文件
        |-- logo.png ------------- 系统logo
        |-- system.js ------------ 系统参数
        |-- theme.js ------------- 主题样式变量配置
    |-- layouts ------------------ 自定义布局组件库
        |-- Home.vue ------------- 主页（已登录）布局
        |-- Unauthorized.vue ----- 未登录布局
    |-- routers ------------------ 路由配置
    |-- store -------------------- 状态管理
        |-- user ----------------- 用户信息
        |-- index.js ------------- 通用
    |-- styles ------------------- 自定义样式表
        |-- common.less ---------- 通用样式表
        |-- nprogress.less ------- nprogress插件样式表
    |-- utils -------------------- 工具函数
        |-- mock ----------------- mock
        |-- api ------------------ api函数
        |-- http ----------------- http配置
        |-- index.js ------------- 未分类的工具函数
    |-- views -------------------- 页面组件库
        |-- example -------------- 示例模板
        |-- 404.vue -------------- 404页
        |-- Hello.vue ------------ 欢迎页
        |-- Login.vue ------------ 登录页
    |-- App.vue------------------- 根组件
    |-- main.js ------------------ 入口文件
|-- .browserslistrc -------------- 目标浏览器配置表
|-- babel.config.js -------------- babel配置
|-- package.json ----------------- package信息
|-- README.md -------------------- 本文件
|-- vue.config.js ---------------- vue配置

```

# 目录解读

## config

项目配置文件所在，包含系统配置（system.js），系统logo（logo.png），以及主题配置（theme.js）

主题配置方案请看[定制主题](https://www.antdv.com/docs/vue/customize-theme-cn/)。

## router

项目默认提供了3个路由，分别是首页（欢迎页），登录页和404页，开发者可以按照自己的需求改造。

```javascript
import Home from '@/layouts/Home.vue' // 首页布局组件

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'Hello',
        component: () => import(/* webpackChunkName: "hello" */ '@/views/Hello.vue')
      }
    ]
  },
  {
    path: '/',
    component: Unauthorized,
    children: [
      {
        path: 'login',
        name: 'Login',
        meta: { auth: false },
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    meta: { auth: false },
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
  }
]
```

meta参数解读：

- auth：是否要登录鉴权
- fixed：静态菜单显示位置，目前仅支持显示在左侧菜单组件，值为'sider'
- icon：菜单的icon type

在开发模式下，会导入模板示例，开发者可以直接复制模板代码到自己的页面组件。如果不想要模板组件，请删除以下代码和文件

```javascript
import exampleRoutes from '../views/example/routes'

if(process.env.NODE_ENV === 'development') {
  // 开发环境下导入模板示例
  routes.push(...exampleRoutes)
}
```

## store

项目的store，包含子模块user和poros

user：用户信息

poros：poros组件库的状态，有menus（左侧菜单），btnAuth（用户权限）和sysList（系统列表）等

## components

项目的自定义组件库，开发者可以自己拓展。

### svg-icon

svg图标组件，会自动导入/src/assets/svgs中的svg。目前仅提供了一个svg图标，开发者可以自己添加属于自己项目的icon。

```vue
<template>
	<svg-icon type="admin" />
</template>
```

参数解读：

- type：svg文件名

## layouts

布局组件库

### Home.vue

集成了SiderMenu（左侧菜单）,SysNav（顶部导航栏）和RouterTabs（路由管理组件）的通用布局。

### Unauthorized.vue

未登录的布局组件

## views

页面组件库，poros会自动获取当前登录用户的菜单权限并添加到动态路由中，菜单配置的组件路径也是以该文件为相对地址找寻组件，例如菜单组件地址的配置是"/template/page1"，则按顺序匹配[ "./views/template/page1/index.js",  "./views/template/page1/index.vue" , "./views/template/page1.js", "./views/template/page1.vue"] 。若没找到，则显示"组件正在开发中"。

在开发组件时，可以添加layout属性，添加动态路由时会自动找到该布局组件作为route的component，为空则默认使用Home。

```vue
<template>
	<div>使用Home布局</div>
</template>

<script>
export default {
    layout: 'Home'
}
</script>
```

## utils

封装了项目的工具函数以及api请求。请求函数使用了poros提供的http，这里只是为其添加了拦截器（看http.js），开发者可以自定义拦截器或者封装自己的请求函数。

# 在项目中使用Poros

在main.js中，可以看到项目引入了poros插件：

```javascript
import Vue from 'vue'
import Poros from 'poros'
import 'poros/lib/style.less'
import router from './router'
import store from './store'
import system from './config/system'

Vue.use(Poros, {
  system,
  store,
  router
})
```

使用该插件后，会全局引入poros组件库，并对store和router进行拓展，以及提供了poros常用的工具函数和api请求函数

参数解读：

- system（必填）：系统配置，包含系统标识，系统名称以及系统logo。（PS：项目运行前，请先确保系统标识已在技术中台-系统管理中注册）
- store（选填）：poros内部自有一套状态管理。如果传入该项目的store，则作为store的子模块(poros)，自定义的组件可通过store.state.poros访问。
- router（选填）：如果传入该项目的router，则poros会自动根据系统标识请求该系统的菜单及权限进行动态路由的添加，并对路由访问进行鉴权。（PS：如果不传，部分业务组件和指令可能无法使用）


# 设置代理

开发前需要配置代理。默认的代理是格创的开发环境，开发者可以在vue.config.js中修改为自己的服务。

```javascript
module.exports = {
    devServer: {
    proxy: {
      '/api': {
        target: 'http://kong.poros-platform.10.74.20.163.nip.io/', // 修改此处代理
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
}
```

# 开发

poros插件已全局安装了ant-design的组件，使用时只需要把前缀'a-'改为'p-'即可。另外还提供了一些业务组件。具体详情请看poros开发手册。

开发者只需要给菜单对应的路由新建页面组件，poros会自动读取并渲染到左侧菜单。让开发者可以更专注于业务的开发。





