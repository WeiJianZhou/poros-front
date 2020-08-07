import { http, utils } from 'poros'
import router from '@/router'
import './mock'
const { removeToken } = utils.auth

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