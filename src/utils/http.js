import { auth } from 'poros/utils'
import http from 'poros/http'
import router from '@/router'
const { removeToken } = auth

/** 添加响应拦截器 */
http.interceptors.response.use(res => {
  switch(res.data.code) {
    case 401:
      removeToken()
      const isDev = process.env.NODE_ENV === 'development'
      if(isDev) {
        router.push('/login').catch(() => {})
      } else {
        window.location.href = '/auth'
      }
      return Promise.reject(res.data.msg)
    default:
      return res
  }
})