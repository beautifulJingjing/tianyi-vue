/**
 * Created by LXP on 2016/3/3.
 * 订购彩铃（单首计费）,要求登录状态
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     ringid：铃声id
 *   },
 *   callback(boolean): 结果回调方法,
 *   error(Error):有错误触发，缺省时触发callback
 * }
 */

const co = require('co')
const order_ring = require('../interfaces/order_ring')

module.exports = ({ req, data = {} }) => {
  return co(function * () {
    if (isNaN(data.ringid)) {
      return Promise.reject('参数错误')
    }
    if (req.current.isLogin) {
      data.uid = req.current.user.id
    } else {
      return Promise.reject('未登录错误')
    }
    yield order_ring({ req, data })
    return true
  })
}
