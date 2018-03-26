/**
 * 彩铃设置
 * data { 
 *  uid（可缺省）:用户ID，缺省时phone必不为空
 *  phone（可缺省）：被叫号码，为空时使用uid绑定的手机号
 *  idtype（可缺省）：铃声id来源，1（默认）-从内容列表，2-从个人彩铃列表，3-活动栏目，4-用户DIY铃声列表
 *  ringid：铃声id
 *  isasyn（可缺省）：铃声设置时效(默认=0)，0-同步，1-完全异步 
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'set_user_crbt'
  data.idtype = data.idtype || 1
  if (isNaN(data.ringid)) {
    return Promise.reject('rid无效')
  }
  if (req.current.isLogin) {
    data.uid = req.current.user.id
  } else {
    return Promise.reject('未登录错误')
  }
  return request({ req, data })
    .then(ret => {
      return ret.res == 1 ? { code: 1 } : { code: ret.res, msg: ret.resmsg }
    })
}
