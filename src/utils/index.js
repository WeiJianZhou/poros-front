/** 问好 */
export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/** 
 * 字符串首字母转大写
 * @param {String} str 被转换字符
 */
export const firstUpperCase = (str) => {
  if(typeof str !== 'string') return ''
  return str.substr(0, 1).toLocaleUpperCase() + str.substr(1).toLocaleLowerCase()
}

// 有路由没组件时显示
const Incomplete = {
  render(h) { return h('p-result', {
    props: {
      status: '500',
      title: '页面正在开发中...'
    }
  }) }
}

/** 
 * 获取页面组件
 * @param {String} componentPath 组件相对路径（@/views）
 */
export const getViewComponent = (function () {
  const load = (path) => {
    try {
      return require(`@/views${path}`)
    } catch(err) {
      return null
    }
  }
  return function(componentPath) {
    const paths = ['', '/index.vue', '.js', '.vue'].map(suffix => componentPath + suffix)
    let component = null, path = ''
    while(path = paths.shift()) {
      component = load(path)
      if(component) return component.default || component
    }
    return Incomplete
  }
})()

/** 
 * 获取布局组件
 * @param {String} name 布局组件名称
 */
export const getLayoutComponent = (function() {
  const load = (path) => {
    try {
      return require(`@/layouts/${path}`)
    } catch(err) {
      return null
    }
  }
  return function(name) {
    const paths = ['', '.js', '.vue', '/index.vue'].map(suffix => name + suffix)
    let component = null
    for(let j in paths) {
      component = load(paths[j])
      if(component) return component.default || component
    }
  }
})()