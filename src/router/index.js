import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress' // progress bar
import '@/styles/nprogress.less'
import Home from '@/layouts/Home.vue'
import exampleRoutes from '../views/example/routes'
import system from '../config/system'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

Vue.use(VueRouter)
const Unauthorized = () => import(/* webpackChunkName: "unauthorized" */ '@/layouts/Unauthorized.vue')

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

const isDev = process.env.NODE_ENV === 'development'

if(isDev) {
  // 开发环境下导入组件示例和模板示例
  routes.push(...exampleRoutes)
}

const router = new VueRouter({
  mode: 'history',
  base: '/' + (isDev ? '' : system.code),
  routes
})

router.beforeEach(async function(to, from, next) {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
