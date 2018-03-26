/**
 * Created by LXP on 2016/3/3.
 * 退订DIY
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     phone（可缺省）: 手机号，为空时使用当前uid
 *   },
 *   callback(boolean): 结果回调方法,
 *   error(Error):有错误触发，缺省时触发callback
 */

const co = require('co')
const unsubscribe_ringset_order = require('../interfaces/unsubscribe_ringset_order')

module.exports = ({ req, data = {} }) => co(function * () {
  const current = req.current
  if (data.phone) {
    delete data.uid
  } else if (current.isLogin) {
    data.uid = current.user.id
  } else {
    return Promise.reject('参数错误')
  }
  const ret = yield unsubscribe_ringset_order({ req, data })
  if (current.isLogin) {
    const user = current.user
    if ((data.uid && data.uid == user.id) || (data.phone && data.phone == user.phone)) {
      user.orderstate = ret.orderstate
      user.orderendtime = ret.orderendtime
    }
    if (ret.res == 1 || ret.res == 1012 || ret.res == 1013) {
      return ret.message
    }
    return '未知'
  }
})
