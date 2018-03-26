
export default {
  install(Vue) {
    Vue.$log = Vue.prototype.$log = function(opt) {
      Vue.$axios({
        url: '/log',
        method: 'post',
        data: {
          type: opt.type || 'event',
          name: opt.name,
          params: JSON.stringify(opt.params),
          network: navigator.connection && navigator.connection.type || '',
          referer: opt.referer || location.pathname,
          msg: opt.msg || ''
        }
      }).then(ret => {
        if (ret.config) {
          window.spconfig = ret.config
        }
      })
    }
  }
}
