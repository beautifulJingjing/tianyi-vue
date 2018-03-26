/**
 * 开彩铃
 * data { 
 *  uid（可缺省）:用户ID，缺省时userphone必不为空；
 *  userphone（可缺省）:手机号，为空时使用uid绑定的号码；
 *  patype（可缺省）:开通方式，0（默认）-由号码本身决定，4-短信2次确认，5-联通0元彩铃；
 *  key（可缺省）:运营商短信验证，需要验证码时-1:发送验证码；
 *  smsdebug（可缺省）:仅pwd=-1时有效，1-返回值message中携带验证码；
 *  inqueue（可缺省）:开通失败时进入等待开通队列，1-进入，0-不进；
 *  withdiy（可缺省）:同时开通DIY标识，0（默认）-不开DIY，1-开通DIY，只在彩铃开通失败时有效，彩铃开通失败进入等待开通队列时，1开通彩铃时同步开通DIY，否则只开通彩铃功能；
 * }
 * return {ret.res}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'open_crbt'
  if (data.hasOwnProperty('key')) {
    data.pwd = data.key
    delete data.key
  }
  return request({ req, data })
    .then(ret => {
      // res=1001进入队列, 2002表示短信已下发
      if (ret.res == 1 || ret.res == 1001 || ret.res == 2002) {
        return ret.res
      }
      else if(data.pwd == -1)
        return Promise.reject(ret.message || '短信发送失败，请稍后再试！')
      else
        return Promise.reject(ret.message || 'sorry ~由于系统原因，彩铃功能开通失败了。\r\n　　请拨打客服电话10000进行开通。\r\n　　开通成功后，即可不限次数的更换彩铃咯。')
    })
}
