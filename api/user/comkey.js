/**
 * Created by LXP on 2016/2/24.
 * 获取手机号、且返回当前用户状态
 * unikey：识别码，为空时返回结果为unikey;
 * sptype（可缺省）：运营商，0-未知，1-移动，2-电信，3-联通（默认）;
 */

const co = require('co')
const url = require('url')
const utils = require('../../utils')
const phoneencry = require('../../utils/phoneencry')
const login = require('../common/login')
const getphonebyimsi = require('../interfaces/getphonebyimsi')

module.exports = (req, res, next) => {
  const { a, unikey, test_mobile } = req.query
  //取用户信息前记录访问到达日志
  req.trace.visit()

  const current = req.current
  const spconfig = current.config

  res.locals.p = co(function * () {
    if (current.user) {
      return current.user
    }
    //不自动取号
    if (spconfig.getphone == 0) {
      if (a) {
        const tempPhone = phoneencry.decode(a)
        if (tempPhone && utils.isTelcomPhone(tempPhone)) {
          current.user = {
            id: 0,
            phone: '',
            temp_phone: tempPhone,
            weixinid: 0,
            orderstate: 4,
            orderendtime: '',
            setcrbtnum: 0
          }
        }
      }
      return current.user || {}
    }
    //参数取号
    if (spconfig.getphone == 2) {
      if (a) {
        const phone = phoneencry.decode(a)
        //号码解密正确并且是电信号码才登录并显示
        if (phone && utils.isTelcomPhone(phone)) {
          current.comkeyStatus = 2
          req.trace.comkey({ phone })
          yield login({ req, data: { type: 2, userinfo: phone, unikey: current.comkeyStatus } })
          return current.user || {}
        }
      }
    }
    //透传取号
    current.comkey = true //透传取号关停,默认置为已透传
    if (current.comkey) {
      return current.user || {}
    }
    // 天翼无透传功能
    if (unikey) {
      //写透传标识，有透传标识后不再进行透传
      current.comkey = unikey
    }
    //透传号码
    let phone = yield getphonebyimsi({ req, data: { unikey: unikey } })
    if (unikey) {
      //透传结果日志
      req.trace.comkey({ phone })
      //透传到号码处理
      if (phone) {
        phone = phone.replace('^(\\+)?(86)?', '')
        if (/^145/.test(phone) || !/^1\d{10}$/.test(phone)) phone = null
      }
      if (!phone) phone = test_mobile
      if (!phone) {
        phone = req.headers['x-up-calling-line-id']
        if (phone) {
          return { phone }
        }
        return {}
      }
      current.comkeyStatus = 1
      yield login({ req, data: { type: 2, userinfo: phone, unikey: current.comkeyStatus } })
      return current.user || {}
    }
    //透传日志
    req.trace.comkey()
    //生成透传地址，去透传
    const dir = url.parse(req.originalUrl)
    dir.query = {
      unikey: phone,
      spinfocode: current.spinfocode
    }
    delete dir.search //不删除将会替代query属性
    return { redirect: url.format(dir) }
  })

  next()
}
