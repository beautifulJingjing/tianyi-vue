/**
 * Created by LXP on 2016/3/1.
 * 查询用户运营商彩铃状态并缓存
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     phone（可缺省）:手机号，优先级高于uid;
 *     uid（可缺省）:用户ID，无此参数时，使用当前uid;
 *     isgetgtype（可缺省）:是否查询号码类型，0-否，1-是，根据配置，0元彩铃默认值1，否则0
 *     iscache（可缺省）：是否从缓存取，默认true, 只在查询当前用户时有效
 *   },
 *   callback(JSON): 结果回调方法，JSON可能为null，
 *   error(Error):有错误触发，缺省时触发callback
 */

const co = require('co')
const get_user_crbt_state = require('../interfaces/get_user_crbt_state')

module.exports = ({ req, data = {} }) => {
  if (!data.hasOwnProperty('iscache')) {
    data.iscache = true
  }
  const current = req.current
  const spconfig = current.config

  return co(function * () {
    let crbtState = null
    if (data.phone) {
      delete data.uid
    } else if (!data.uid) {
      //phone、uid都没有，用当前登录用户id
      if (current.isLogin) {
        data.uid = current.user.id
        delete data.phone
        if (data.iscache) {
          crbtState = current.crbtState
        }
      } else {
        //未登录直接返回
        return Promise.reject('无登录状态')
      }
    }
    if (!crbtState || crbtState.phone != data.phone || crbtState.uid != data.uid) {
      if (!data.hasOwnProperty('isgetgtype')) {
        data.isgetgtype = spconfig.crbt.mode == 2 ? 1 : 0
      }
      const retState = yield get_user_crbt_state({ req, data })
      if (data.phone) {
        retState.phone = data.phone
      } else {
        retState.uid = data.uid
      }
      current.crbtState = retState
      return retState
    }
    return crbtState
  })
}
