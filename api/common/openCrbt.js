/**
 * Created by LXP on 2016/3/3.
 * 开通运营商彩铃功能
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     userphone（可缺省）:手机号，只在短信开通方式时有效，为空时使用当前登录用户绑定号码;
 *     key（可缺省）:运营商短信验证，需要验证码时-1:发送验证码;
 *     patype（可缺省）:开通方式，0-由号码本身决定，4-短信2次确认，5-联通0元彩铃
 *   },
 *   callback(boolean): 结果回调方法,
 *   error(Error):有错误触发，缺省时触发callback
 */
const co = require('co')
const utils = require('../../utils')
const open_crbt = require('../interfaces/open_crbt')
const login = require('./login')
const send_business_sms = require('../interfaces/send_business_sms')

module.exports = ({ req, data = {} }) => co(function * () {
  const spconfig = req.current.config
  //电信铃音盒且会员弹窗=2，同步开DIY
  if (spconfig.order.mode == 903 && spconfig.order.pop.pop == 2) {
    data.withdiy = 1
    data.inqueue = 1
  }

  if (isNaN(data.patype)) {
    switch (+spconfig.crbt.mode) {
      case 1:
        data.patype = 0 //由号码本身决定
        break
      case 2:
        data.patype = 5 //0元彩铃
        break
    }
  }
  let openType = +spconfig.crbt.open
  if (data.key) openType = 3
  switch (openType) {
    case 0: //不开通
      return Promise.reject('不予开通')
    case 1: //无验证开通，要求登录
      if (req.current.isLogin) {
        const u = req.current.user
        data.uid = u.id
        data.userphone = u.phone
        //开通失败入队列
        switch (+spconfig.crbt.asyncopen) {
          case 1:
            data.inqueue = 1
            break
          case 2: //队列同步开DIY
            data.inqueue = 1
            if (spconfig.order.pop.pop == 2) data.withdiy = 1
            break
        }
        //是电信号码，需要强制无验证码
        if (utils.isTelcomPhone(data.userphone)) {
          data.patype = 1
        }

        const openResult = yield open_crbt({ req, data })
        yield login({ req, data: { type: 2, userinfo: data.userphone } })

        switch (+openResult) {
          case 1:
          case 1001:
            req.current.isOpenCrbtWaiting = true
            //开通成功和进入队列，清理彩铃状态缓存，否则发送短信成功不清理
            req.current.crbtState = null
            break
        }
        return true
      }
      return Promise.reject('未登录错误')
    case 2: //短信回复
      let uphone = null
      if (data.userphone) {
        uphone = data.userphone
      } else if (req.current.isLogin) {
        uphone = req.current.user.phone
      } else {
        return Promise.reject('参数错误')
      }
      yield send_business_sms({ req, data: { uphone } })
      // 短信发送成功，清理彩铃状态缓存
      req.current.crbtState = null
      return true
    case 3: //短信验证
      if (!(data.userphone || req.current.isLogin) || !data.key) {
        return Promise.reject('参数错误')
      }
      if (data.userphone) {
        delete data.uid
      } else {
        const user = req.current.user
        data.uid = user.id
        data.userphone = user.phone
      }
      //电信号码，根据弹窗设置彩铃、DIY同时开
      if (utils.isTelcomPhone(data.userphone) && spconfig.order.pop.pop == 2) {
        data.withdiy = 1
      }
      //短信验证方式,失败原结果返回
      const openResult = yield open_crbt({ req, data })
      switch (+openResult) {
        case 1:
          if (spconfig.order.mode == 903) {
            yield login({ req, data: { type: 2, userinfo: data.userphone } })
            req.current.isOpenCrbtWaiting = true
            return true
          }
          break
        case 1001:
          req.current.crbtState = null
          if (!req.current.isLogin || req.current.user.phone != data.userphone) {
            yield login({ req, data: { type: 2, userinfo: data.userphone } })
            req.current.isOpenCrbtWaiting = true
            return true
          }
          req.current.isOpenCrbtWaiting = true
          break
      }
      return true
  }
})
