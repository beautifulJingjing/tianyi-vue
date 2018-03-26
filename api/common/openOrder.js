/**
 * Created by LXP on 2016/3/2.
 * 订购DIY
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     userphone（可缺省）：手机号，只有该运营商支持开通包月时绑定手机号功能，且该用户未绑定手机时，该参数才起效
 *     key（可缺省）：验证码，-1-请求下发验证码
 *   },
 *   callback(boolean): 结果回调方法,
 *   error(Error):有错误触发，缺省时触发callback
 */

const co = require('co')
const utils = require('../../utils')
const login = require('./login')
const open_ringset_order = require('../interfaces/open_ringset_order')
const send_business_sms = require('../interfaces/send_business_sms')

module.exports = ({ req, data = {} }) => co(function * () {
  const current = req.current
  const spconfig = current.config

  data.isrsms = spconfig.order.sendsms.isrsms
  data.isosms = spconfig.order.sendsms.isosms
  data.isqsms = spconfig.order.sendsms.isqsms

  switch (+spconfig.order.mode) {
    case 1://月免
      data.ordertype = 0
      data.delaynum = 0
      break
    case 2://免3d
      data.ordertype = 1
      data.delaynum = 3
      break
    case 3://免7d
      data.ordertype = 1
      data.delaynum = 7
      break
    case 4://免30d
      data.ordertype = 1
      data.delaynum = 30
      break
    case 5://无免
      data.ordertype = 1
      data.delaynum = 0
      break
    case 901://重庆免2月（1060），delaynum无作用
      data.ordertype = 4
      data.delaynum = 0
      break
    case 902://浙江wo+，delaynum无作用
      data.ordertype = 5
      data.delaynum = 0
      break
    case 903://电信铃音盒反向计费，delaynum无作用
      data.ordertype = 6
      data.delaynum = 0
  }

  let isShunt = false
  let spinfocode = current.spinfocode
  if (spconfig.order.mode == 902) {
    //沃加透传到号码调用分流code，未透传到号码login方式订购
    isShunt = true
    spinfocode = '03330090021' + spinfocode.substr(7, 3)
  } else if (spconfig.order.shunt == 0 || Math.random() * 100 > spconfig.order.shunt) {
    // 正常调用，code不改变
  } else {
    // 分流，code改变
    isShunt = true
    spinfocode = '03000040171' + spinfocode.substr(7, 3)
  }

  if (isShunt) {
    data.spinfocode = spinfocode
  }
  // 订购
  let openType = 1
  if (data.hasOwnProperty('key')) openType = 3
  switch (openType) {
    case 0:
      // 不开通
      return Promise.reject('不予开通')
    case 1:
      // 无验证开通，要求登录
      if (current.isLogin) {
        const user = current.user
        data.uid = user.id
        data.userphone = user.phone
        const openResult = yield open_ringset_order({ req, data })
        if (openResult.hasOwnProperty('orderstate')) {
          user.orderstate = openResult.orderstate
          user.orderendtime = openResult.orderendtime
        } else {
          // 订购成功，一般为免费期状态
          // 无免时，订购成功状态
          user.orderstate = spconfig.order.mode == 5 ? 2 : 0
          user.orderendtime = -1
        }
        return true
      }
      return Promise.reject('未登录错误')
    case 2:
      // 短信回复
      let uphone = null
      if (data.userphone) {
        uphone = data.userphone
      } else if (current.isLogin) {
        uphone = current.user.phone
      } else {
        return Promise.reject('参数错误')
      }
      yield send_business_sms({ req, data: { uphone } })
      return true
    case 3:
      // 短信验证
      if (!(data.userphone || current.isLogin) || !data.key) {
        return Promise.reject('参数错误')
      }
      if (data.userphone) {
        data.uid = ''
      } else {
        const user = current.user
        data.uid = user.id
        data.userphone = user.phone
      }
      // 电信号码，根据弹窗设置彩铃、DIY同时开
      if (utils.isTelcomPhone(data.userphone) && spconfig.ringset.serve==1 && spconfig.crbt.pop.pop==2) {
        data.isopencrbt = 1
      }
      // 短信验证方式,失败原结果返回
      const openResult = yield open_ringset_order({ req, data })
      // 不是验证码下发成功
      if (openResult.result != 2002) {
        // 订购验证成功：未登录或号码变更，做登录操作
        if (!current.isLogin || current.user.phone != data.userphone) {
          yield login({ req, data: { type: 2, userinfo: data.userphone } })
          //彩铃同时开通时，记录彩铃开通，清理彩铃状态
          if (data.isopencrbt == 1) {
            current.isOpenCrbtWaiting = true
            current.crbtState = null
          }
          return true
        } else {
          const user = current.user
          if (openResult.hasOwnProperty('orderstate')) {
            user.orderstate = openResult.orderstate
            user.orderendtime = openResult.orderendtime
          } else {
            //订购成功，一般为免费期状态
            //无免时，订购成功状态
            user.orderstate = spconfig.order.mode == 5 ? 2 : 0
            user.orderendtime = -1
          }
          //彩铃同时开通时，记录彩铃开通，清理彩铃状态
          if (data.isopencrbt == 1) {
            current.isOpenCrbtWaiting = true
            current.crbtState = null
          }
        }
      }
      return true
  }
})
