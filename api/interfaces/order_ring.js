/**
 * 订购彩铃（每首计费）
 * data { 
 *  ringid:铃声id
 *  uid（可缺省）:用户ID，缺省时uphone不能为空
 *  uphone（可缺省）:手机号码，uid缺省或未绑定号码时使用
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'order_ring'
  return request({ req, data, special: true })
    .then(ret => {
      // 10051重复订购
      if (ret.code == 1 || ret.code == 10051) {
        return true
      }
      return Promise.reject(ret.msg)
    })
}
