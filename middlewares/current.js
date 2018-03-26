/**
 * 当前请求信息
 */

const config = require('../config')
const utils = require('../utils')
const moment = require('moment')
const configure = require('../utils/configure')

module.exports = () => {
  return (req, res, next) => {
    req.current = {
      /**
       * config
       */

      config: null,

      /**
       * spinfocode
       */

      get spinfocode() {
        return req.session.spinfocode
      },
      set spinfocode(val) {
        req.session.spinfocode = val
      },

      /**
       * 用户信息session
       * id: "25772605"
       * orderendtime: -1
       * orderstate: 2
       * phone: "17767188627"
       * setcrbtnum: 0
       * weixinid: ""
       */

      get user() {
        return req.session.USER
      },
      set user(val) {
        req.session.USER = val
      },
      
      /**
       * 登录状态, 无手机号、非联通号且非DIY的登录认为是未登录
       */

      get isLogin() {
        const user = this.user
        // 如微信登录未绑定手机号认为未登录
        if (!user || !user.id || !user.phone) {
          return false
        }
        // 是移动号码 || 是电信号码并且会员开通方式是电信emp
        // 如果是非会员则视为未登录
        if (
          utils.isMobilePhone(user.phone)
          || (utils.isTelcomPhone(user.phone) && this.config.order.mode == 5)
        ) {
          return user.orderstate != 4
        }
        return true
      },

      /**
       * 到达标识
       */

      get visit() {
        return req.session.VISIT
      },
      set visit(val) {
        req.session.VISIT = val
      },

      /**
       * 透传key
       */

      get comkey() {
        return req.session.COMKEY
      },
      set comkey(val) {
        req.session.COMKEY = val
      },

      /**
       * 透传结果状态
       */

      get comkeyStatus() {
        return req.session.COMKEY_STATUS
      },
      set comkeyStatus(val) {
        req.session.COMKEY_STATUS = val
      },

      /**
       * DIY开通失败标识，长期cookie
       */
      ioofCookieStr() {
        return `order-openfail-${this.user.phone}`
      },
      get isOpenOrderFail() {
        if (this.isLogin) {
          const cookieName = this.ioofCookieStr()
          return req.session[cookieName] || req.cookies[cookieName]
        }
        return false
      },
      set isOpenOrderFail(val) {
        // session同时写，不写session，cookie未写回时返回值错误
        if (this.isLogin) {
          const cookieName = this.ioofCookieStr()
          if (val) {
            req.session[cookieName] = val
            res.cookie(cookieName, val)
          } else {
            req.session[cookieName] = null
            res.clearCookie(cookieName)
          }
        }
      },

      /**
       * 彩铃状态 避免彩铃状态、0元开通检查时重复调用，彩铃开通接口调用时需要清理，val=JSON, =null清理
       */

      get crbtState() {
        return req.session.CRBT_STATE
      },
      set crbtState(val) {
        req.session.CRBT_STATE = val
      },

      /**
       * 彩铃开通等待标识 24小时cookie，用于开通成功查询未开通时的处理，val=boolean
       */

      iocwCookieStr() {
        return `crbt-openwait-${this.user.phone}`
      },
      get isOpenCrbtWaiting() {
        if (this.isLogin) {
          const cookieName = this.iocwCookieStr()
          return req.session[cookieName] || req.cookies[cookieName]
        }
        return false
      },
      set isOpenCrbtWaiting(val) {
        if (this.isLogin) {
          const cookieName = this.iocwCookieStr()
          if (val) {
            req.session[cookieName] = val
            // res.cookie(cookieName, val, { expires: new Date(moment().add(1, 'd')) })
            res.cookie(cookieName, val, { maxAge: 24 * 3600 * 1000 })
          } else {
            req.session[cookieName] = null
            res.clearCookie(cookieName)
          }
        }
      },

      /**
       * ip
       */

      get ip() {
        return req.headers['x-forwarded-for'] || req.ip
      },

      /**
       * 是否微信浏览器
       */

      get isMicroMessenger() {
        return /MicroMessenger/i.test(req.headers['user-agent'])
      },
    }

    // 初始化spinfocode
    let spinfocode = req.query.spinfocode || req.body.spinfocode || req.session.spinfocode || config.spinfocode
    if (/[^\d]/.test(spinfocode)) {
      spinfocode = spinfocode.substr(0, 11)
    }

    // 获取配置
    configure(spinfocode)
      .then(ret => {
        req.current.spinfocode = ret.id
        req.current.config = ret
        next()
      })
  }
}
