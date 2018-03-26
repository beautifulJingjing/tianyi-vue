import axios from 'axios'
import store from '../store'

function alertMsg(msg) {
  store.commit('updateModal', { title: '出错啦', content: msg })
}

export default {
  install(Vue) {
    Vue.$axios = Vue.prototype.$axios = function(opt) {
      opt.url = `/api${opt.url}`
      opt[opt.method.toLowerCase() === 'get' ? 'params': 'data'].spinfocode = Vue.$spinfocode
      opt.timeout = 1000 * 60
      return new Promise((resolve, reject) => {
        axios(opt)
          .then(rec => {
            const { s, data, msg } = rec.data
            if (s === 1) {
              resolve(data)
            } else {
              this.updateLoading({show: false,content: ''})
              alertMsg(msg)
            }
          })
          .catch(err => {
            if(opt.url == '/api/log') {
              retrun;
            } else {
              alertMsg('服务器出错了')
            }
          })
      })
    }
  }
}
