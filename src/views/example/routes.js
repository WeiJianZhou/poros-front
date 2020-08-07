import Home from '@/layouts/Home.vue'

export default [
  {
    path: '/example',
    name: '模板示例',
    component: Home,
    meta: {
      fixed: 'sider',
      icon: 'yunbushu'
    },
    children: [
      {
        path: 'template1',
        name: '普通搜索',
        meta: {
          icon: 'yunbushu'
        },
        component: () => import(/* webpackChunkName: "template1" */ '@/views/example/templates/template1.vue')
      }
    ]
  }
]