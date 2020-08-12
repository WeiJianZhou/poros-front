import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress' // progress bar
import '@/styles/nprogress.less'
import { auth } from 'poros/utils'
import store from '../store'
import Home from '@/layouts/Home.vue'
import system from '../config/system'
import { firstUpperCase, getViewComponent, getLayoutComponent } from '@/utils'
import exampleRoutes from '@/views/example/routes'

const { getToken } = auth

nprogress.configure({ showSpinner: false }) // nprogress Configuration

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
  nprogress.start()
  if(to.meta.hasOwnProperty('auth') && !to.meta.auth) {
    next()
    return false
  }
  if(getToken()) {
    if(!store.state.poros.menus) {
      await store.dispatch('requestMenus')
      router.addRoutes([
        ...createRouteByMenus(),
        { path: '*', redirect: '/404' }
      ])
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else {
    if(isDev) next('/login')
    else location.href = `/authlogin?fromUrl=${location.href}`
  }
})

router.afterEach(() => {
  nprogress.done()
})

/** 根据url获取组件名称 */
function getComponentName(url) {
  return typeof url === 'string' ? url.split('/').map(firstUpperCase).join('') : ''
}

// iframe组件
const createIframe = src => ({
  render(h) { return h('iframe', { attrs: { src }, style: 'width: 100%;height: 100%;border: none;' }) }
})

/** 根据menus创建动态路由 */
export function createRouteByMenus() {
  const newRoutes = []
  if(!store.state.poros.menus.length) return newRoutes
  const routesMap = new Map()
  let queues = [].concat(store.state.poros.menus), item = null
  while(item = queues.shift()) {
    if(item.children && item.children.length) {
      queues = queues.concat(item.children)
    } else if(item.url && (item.target === 'render' || item.target === 'iframe')) {
      let component = null
      const newRoute = {
        path: item.url,
        meta: { title: item.name, auth: true }
      }
      if(item.target === 'render') {
        newRoute.name = getComponentName(item.url)
        component = getViewComponent(item.componentPath)
      } else {
        newRoute.name = `iframe${item.id}`
        newRoute.path = '/' + newRoute.name
        component = createIframe(item.url)
      }
      newRoute.component = component
      if(self.frameElement && self.frameElement.tagName == "IFRAME") {
        newRoutes.push(newRoute)
      } else {
        const layout = component.layout || 'Home'
        if(routesMap.get(layout)) {
          routesMap.get(layout).children.push(component)
        } else {
          const layoutComponent = getLayoutComponent(layout)
          if(layoutComponent) {
            const layoutRoute = { path: '', component: layoutComponent, children: [newRoute] }
            routesMap.set(component.layout, layoutRoute)
            newRoutes.push(layoutRoute)
          }else {
            newRoutes.push(newRoute)
          }
        }
      }
    }
  }
  return newRoutes
}

export default router
