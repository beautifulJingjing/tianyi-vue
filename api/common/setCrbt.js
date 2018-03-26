/**
 * Created by LXP on 2016/3/3.
 * 彩铃设置，要求登录状态
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     ringid：铃声id, 可以是数组;
 *     idtype（可缺省）：铃声id来源，1（默认）-从内容列表，2-从个人彩铃列表，3-活动栏目，4-用户DIY铃声列表
 *   },
 *   callback(boolean): 结果回调方法,
 *   error(Error):有错误触发，缺省时触发callback
 */

const co = require('co')
const set_user_crbt = require('../interfaces/set_user_crbt')

module.exports = ({ req, data = {} }) => co(function * () {
  const spconfig = req.current.config

  if (!data.ringid) {
    return Promise.reject('参数错误')
  }
  if (!req.current.isLogin) {
    return Promise.reject('未登录错误')
  }
  const rids = data.ringid.replace(/, *,/g, ',').split(',')
  for (let i in rids) {
    if (isNaN(rids(i))) {
      return Promise.reject('参数错误')
    }
  }
  //根据ringid数据确定使用同步/异步
  if (rids.length > 1) {
    data.isasyn = spconfig.ringset.muchset.sync == 1 ? 0 : 1
  } else {
    data.isasyn = spconfig.ringset.singleset.sync == 1 ? 0 : 1
  }
  //确定ringid类型，缺省为内容列表
  if (isNaN(data.idtype)) {
    data.idtype = 1
  }
  //设置用户
  data.uid = req.current.user.id

  for (let i in rids) {
    data.ringid = rids[i]
    const setRet = yield set_user_crbt({ req, data })
    if (setRet.code !== 1) return false
  }

  return true
})
