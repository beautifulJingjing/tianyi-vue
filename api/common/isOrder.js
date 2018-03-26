/**
 * Created by XUER on 2016-2-27.
 * 检查是否开通DIY
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     uid（可缺省）:用户ID;
 *     phone（可缺省）:手机号，uid、phone都没有时查当前用户
 *   },
 *   callback(boolean): 结果回调方法,
 *   error(Error):有错误触发，缺省时触发callback
 */

const co = require('co')
const login = require('../interfaces/login')
const get_user_orderstate = require('../interfaces/get_user_orderstate')

module.exports = ({ req, data = {} }) => co(function * () {
  const { phone, uid } = data
  
  if (phone) {
    // 通过手机号查DIY状态
    let ret = null
    try {
      ret = yield login({ req, data: { userinfo: phone, type: 2 } })
    } catch (err) {
      return false
    }
    const user = req.current.user
    // 是当前用户，更新状态
    if (user && user.phone === phone) {
      user.orderstate = (ret.orderstate == 2 && ret.orderendtime > +new Date()) ? 3 : ret.orderstate
      user.orderendtime = ret.orderendtime
    }
    return ret.orderstate !== 4
  }
  if (uid) {
    let ret = null
    try {
      ret = yield get_user_orderstate({ req, data: { uid } })
    } catch (err) {
      return false
    }
    const user = req.current.user
    if (user && user.id == uid) {
      user.orderstate = ret.orderstate
      user.orderendtime = ret.orderendtime
    }
    return ret.orderstate !== 4
  }
  if (req.current.isLogin) {
    return req.current.user.orderstate != 4
  }
  return false
})
