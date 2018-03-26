/**
 * Created by XUER on 2016-2-28.
 * 检查是否开通彩铃
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     phone（可缺省）:手机号，优先级高于uid;
 *     uid（可缺省）:用户ID，无此参数时，使用当前uid;
 *     iscache（可缺省）：是否从缓存取，默认true, 只在查询当前用户时有效
 *   },
 *   callback(boolean): 结果回调,
 *   error(Error):有错误触发，缺省时触发callback
 */

const co = require('co')
const getCrbtState = require('./getCrbtState')

module.exports = ({ req, data = {} }) => co(function * () {
  let retState = null
  try {
    retState = yield getCrbtState({ req, data })
  } catch (err) {
    return false
  }
  if (retState) {
    const isCrbt = retState.iscrbt == 1
    if (isCrbt) {
      //彩铃开通状态，清理彩铃等待开通cookie标识
      req.current.isOpenCrbtWaiting = null
    }
    return isCrbt
  }
  return false
})
