/**
 * 用户付费状态查询
 * data { 
 *  uid:用户ID
 * }
 * return {}
 */
/**
 * orderstate 付费状态
    0 未付费，试用期过期
    1 未付费，试用期中
    2 付费期中，试用期过期
    3 付费期中，试用期中
    4 付费期过期，试用期中
    5 付费期过期，试用期过期
    6 预付费
  orderendtime 付费期结束时间戳（UTC时间 -1为自动续费）
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'get_user_orderstate'
  return request({ req, data })
    .then(ret => {
      switch (+ret.orderstate) {
        case 1:
          ret.orderstate = 0
          break
        case 2:
        case 3:
          ret.orderstate = ret.orderendtime == -1 ? 2 : 3
          break
        case 0:
        case 4:
        case 5:
          ret.orderstate = 4
          break
        case 6:
          ret.orderstate = 1
          break
        default:
          console.log(`get_user_orderstate: orderstate未重设`)
      }
      return ret
    })
}
