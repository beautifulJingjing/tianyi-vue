/**
 * 下发业务短信
 * data { 
 *  uphone:手机号
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  // 2分钟内不重复发送短信
  const lastTime = req.session.SEND_BUSINESS_SMS
  if (+new Date() - lastTime < 2 * 60000) {
    return Promise.resolve(true)
  }

  data.service = 'send_business_sms'
  return request({ req, data })
    .then(ret => {
      req.session.SEND_BUSINESS_SMS = +new Date()
      return ret
    })
}
