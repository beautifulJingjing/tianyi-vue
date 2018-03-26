/**
 * 开通DIY功能报告，江苏安讯开通接口在使用
 *  phone: 手机号
 *  orderid： 订购产品，-1-预订购，0000000764、0000000809等
 *  isrsms：预订购时是否发送短信（缺省=0）
 *  isosms：正式订购时是否发送短信（缺省=0）
 *  isqsms：回复确认短信（缺省=0）
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'open_orderreport'
  return request({ req, data })
    .then(ret => {
      if (ret.res != 1) {
        return Promise.reject(ret.message)
      }
      return ret
    })
}
