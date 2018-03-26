/**
 * 退订DIY
 * data { 
 *  uid（可缺省）:用户ID，缺省时phone必不为空
 *  phone（可缺省）: 手机号
 * }
 * return {
 *  unsubscript（true）: 退订结果
 *  orderstate: 退订后会员状态
 *  orderendtime: 退订后会员到期时间
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'unsubscribe_ringset_order'
  return request({ req, data })
   .then(ret => {
     if (ret.res == 1 || ret.res == 1012 || ret.res == 1013) {
       //预定购退订是直接退订为非会员
       switch (+ret.orderstate) {
         case 1:
         case 2:
         case 3:
            if (ret.orderendtime == -1) {
              ret.orderstate = ret.orderstate == 2 ? 2 : 0
            } else {
              ret.orderstate = 3
            }
            break
         case 0:
         case 4:
         case 5:
         case 6:
            ret.orderstate = 4
            break
         default:
            console.log(`unsubscribe_ringset_order: orderstate未重设`)
       }
       return ret
     }
     return Promise.reject(ret.message)
   })
}
