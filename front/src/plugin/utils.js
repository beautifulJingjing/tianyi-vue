
// 工具对象
const utils = {
  query(name) {
    const right = location.search.substr(1).split(`${name}=`)[1]
    return right ? right.split('&')[0] : ''
  }
}

export default {
  install(Vue) {
    // 初始的spinfocode
    Vue.$spinfocode = Vue.prototype.$spinfocode = window.spcode
    // 链接要统一加上spinfocode参数
    Vue.$setLink = Vue.prototype.$setLink = (name, options = {}) => {
      return Object.assign({ name, query: { spinfocode: window.spcode } }, options)
    }

    Vue.$audio = Vue.prototype.$audio = new Audio()

    Vue.$audioSrc = Vue.prototype.$audioSrc = (rid) => {
      return `${__ENV__ === 'dev' ? 'http://192.168.104.233:3000' : ''}/api/audition.mp3?rid=${rid}`
    }

    // 工具
    Vue.$utils = Vue.prototype.$utils = utils
  }
}
