/**
 * 获取短信验证码
 * data { 
 *  mobile, 
 *  type: 用途，0(默认)-绑定手机;1-订购;2-退订;3-预付费;4-集团炫铃;5-母亲节活动 
 * }
 * return {
 *  vcode: 返回短信验证码,部分用途无返回 
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'send_vcode'
  return request({ req, data })
    .then(ret => ret.vcode)
}
