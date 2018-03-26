/**
 * Created by XUER on 2016-3-1.
 * 注册登录
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     type：登录类型：1-设备标识码登录，2-手机号登录，3-用户名/密码，4-新浪微博登录，5-QQ，6-微信
 *     userinfo：登录信息
 *     autoregister（可缺省）：当用户不存在时，是否自动注册：0-不注册，1-注册（默认）
 *     ischeckorder（可缺省）：是否与运营商同步号码状态：0-否（默认），1-是
 *     unikey：号码透传状态，缺省=0
 *   },
 *   callback(boolean): 结果回调方法,
 *   error(Error):有错误触发，缺省时触发callback
 */

const co = require('co')
const login = require('../interfaces/login')

module.exports = ({ req, data = {} }) => {
  const current = req.current
  data = Object.assign(
    { autoregister: 1 },
    data
  )
  current.comkeyStatus = data.hasOwnProperty('unikey') ? data.unikey : 0
  req.trace.event({ name: 'doLogin', params: data })

  return co(function * () {
    const { uid, mobile, weixin, orderstate, orderendtime, setcrbtnum, ishistoryorder } = yield login({ req, data })
    const user = {
      id: uid,
      phone: mobile,
      weixinid: weixin,
      orderstate,
      orderendtime,
      setcrbtnum,
      ishistoryorder,
    }
    if (orderstate == 2 && orderendtime > +new Date()) user.orderstate = 3
    current.user = user
    current.crbtState = null
    if (user.phone && user.orderstate != 4) {
      //是会员，清理开通失败cookie标识
      current.isOpenOrderFail = false
    }
    return true
  })
}
