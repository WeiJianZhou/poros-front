import Vue from 'vue'
import App from './App.vue'
import Poros from 'poros'
import PorosUI from 'poros/ui'
import 'poros/ui/style'
import router from './router'
import store from './store'
import system from './config/system'
import './utils/http'
import './styles/common.less'
import SvgIcon from '@/components/svg-icon'

Vue.config.productionTip = false

Vue.use(SvgIcon)

Vue.use(Poros, {
  system: Object.assign(system, {
    logo: require('./config/logo.png')
  }),
  store
})
Vue.use(PorosUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
