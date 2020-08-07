import Vue from 'vue'
import SvgIcon from './svg-icon.vue'

const req = require.context('@/assets/svgs', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

SvgIcon.install = function() {
  Vue.component(SvgIcon.name, SvgIcon)
}

export default SvgIcon