/**
 * 用户登录/注册
 * data { 
 *  type：登录类型：1-设备标识码登录，2-手机号登录，3-用户名/密码，4-新浪微博登录，5-QQ，6-微信
 *  userinfo：登录信息
 *  autoregister（可缺省）：当用户不存在时，是否自动注册：0-不注册（默认），1-注册
 *  ischeckorder（可缺省）：是否与运营商同步号码状态：0-否（默认），1-是
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'login'
  return request({ req, data })
}
