/**
 * DIY功能开通
 * data { 
 *  spinfocode:渠道标识，有分流时有用
 *  uid（可缺省）:用户ID，缺省时userphone必不为空
 *  userphone（可缺省）：手机号，只有该运营商支持开通包月时绑定手机号功能，且该用户未绑定手机时，该参数才起效
 *  ordertype：订购方式，0（默认）-根据渠道编码设置，1-n天后订购，2-特定时间点订购，3-下月1号订购，4-免2产品（1060），5-wo+
 *  delaynum：ordertype=1时为延期天数，ordertype=2时订购时间（格式 yyyymmdd）
 *  key（可缺省）：验证码，-1-请求下发验证码
 *  isrsms：预订购时是否发送短信（缺省=0）
 *  isosms：正式订购时是否发送短信（缺省=0）
 *  isqsms：回复确认短信（缺省=0）
 *  isopencrbt：是否同时开通炫铃功能（缺省=0）（仅电信号码有效）
 * }
 * return {
 *  result（int）: 包括开通、已开通、发下短信成功
 *  orderstate: 会员状态，已开通时无返回
 *  orderendtime: 会员到期时间，已开通时无返回
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'open_ringset_order'
  data.type = 1 //时间类型：1-包月，2-包年，3-预付费
  return request({ req, data })
    .then(ret => {
      // res=1015该号码已经是会员，不能再次预付费；ordertype=5、res=2002表示短信已下发
      if (ret.res == 1 || ret.res == 1015 || ret.res == 2002) {
        const result = { result: ret.res }
        if (ret.res == 1) {
          Object.assign(
            result,
            {
              orderstate: ret.orderstate,
              orderendtime: ret.orderendtime
            }
          )
        }
        return result
      }
      return Promise.reject(ret.message)
    })
}
