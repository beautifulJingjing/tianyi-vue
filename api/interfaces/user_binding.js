/**
 * 用户信息绑定
 * data { 
 *  uid: 绑定用户ID, 
 *  info: 绑定内容, 
 *  type: 内容类型，1-手机号，2X-微博（21-新浪微博，22-腾讯微博），3-QQ(33-微信), 
 *  operating: 0-解除绑定，1-绑定
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'user_binding'
  return request({ req, data })
}
