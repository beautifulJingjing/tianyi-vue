/**
 * Created by LXP on 2016/3/4.
 * 登录
 * switch (config.order.mode) {
 *  5: 无免 loginOrder
 *  903 && login.mode != 1: 电信铃音盒 loginCrbt
 * }
 * return {
 *  type: 1普通登录 2登录开会员 3登录开彩铃,
 *  user: 用户信息,
 *  order: { code: 1已开通 20开通成功 -21开通失败 -24不支持的开通方式 },
 *  crbt: { code: 1已开通 31开通中 30开通成功 -31开通失败 -33该手机号暂不能参加 -34不支持的开通方式 }
 * }
 */

const co = require('co')
const utils = require('../../utils')
const { checkCode } = require('../common/checkCode')
const login = require('../common/login')
const openOrder = require('../common/openOrder')
const isCrbt = require('../common/isCrbt')
const isCrbtOpening = require('../common/isCrbtOpening')
const openCrbt = require('../common/openCrbt')
const isOrder = require('../common/isOrder')
const isCrbtFreeSupport = require('../common/isCrbtFreeSupport')

module.exports = (req, res, next) => {
  const { phone, checkcode, single = false } = req.body // single暂时无用
  const current = req.current
  const spconfig = current.config

  res.locals.p = co(function * () {
    if (!utils.isPhone(phone)) {
      return Promise.reject('请输入一个有效的手机号！')
    }
    if (!checkcode) {
      return Promise.reject('请输入验证码！')
    }
    
    // 登录并开会员
    if (spconfig.order.mode == 5) {
      const result = { type: 2 }
      // 验证码开通
      if (spconfig.order.open == 3) {
        const _isOrder = yield isOrder({ req, data: { phone } })
        yield openOrder({ req, data: { userphone: phone, key: checkcode } })
        result.user = current.user
        result.order = { code: _isOrder ? 1 : 20 }
        
        return result
      }
      // 正常开通
      yield checkCode({ req, data: { phone, checkcode } })
      yield login({ req, data: { userinfo: phone, type: 2 } })
      result.user = current.user
      if (yield isOrder({ req })) {
        result.order = { code: 1 }
      } else {
        try {
          yield openOrder({ req })
        } catch (err) {
          result.order = { code: -21, msg: err }
          return result
        }
        result.order = { code: 20 }
      }
      //验证登录后的开彩铃
      //只开会员、彩铃设置不是先开DIY再开彩铃、彩铃开通方式为非正常开通、彩铃开通弹窗设置不是DIY+彩铃同步开通弹窗时，不开通彩铃功能，输出结果
      if (single
        || spconfig.ringset.serve != 1
        || spconfig.crbt.open != 1
        || spconfig.crbt.pop.pop != 2
      ) {
        // 不对result做处理
      } else {
        if (yield isCrbt({ req })) {
          result.crbt = { code: 1 }
        } else {
          if (yield isCrbtOpening({ req })) {
            result.crbt = { code: 31, msg: '彩铃功能开通中，请耐心等待！' }
          } else if (utils.isUnicomPhone(req.current.user.phone)) {
            //DIY+彩铃同步正常开通只支持联通号
            try {
              yield openCrbt({ req })
            } catch (err) {
              result.crbt = {
                code: -31,
                msg: err.message
              }
            }
            if (yield isCrbtOpening({ req })) {
              result.crbt = { code: 31, msg: '彩铃功能开通中，请耐心等待！' }
            } else {
              result.crbt = { code: 30 }
            }
          } else {
            result.crbt = {
              code: -34,
              msg: '不支持的彩铃开通方式！'
            }
          }
        }
      }
      return result
    }
    // 登录并开彩铃
    if (spconfig.order.mode == 903 && spconfig.login.mode != 1) {
      const result = { type: 3 }
      if (spconfig.login.mode == 3 && spconfig.order.mode == 903 || spconfig.crbt.open == 3) {
        // 验证码开通
        const crbtState = yield isCrbt({ req, data: { phone } })
        let orderState
        // 合并弹窗=合并开通，检查会员状态
        if (spconfig.order.pop.pop == 2) {
          orderState = yield isOrder({ req, data: { phone } })
        }
        // open crbt
        yield openCrbt({ req, data: { userphone: phone, key: checkcode } })
        result.user = current.user
        if (crbtState) {
          result.crbt = { code: 1 }
          if (orderState !== undefined) {
            result.order = { code: orderState ? 1 : 20 }
          }
          return result
        }
        if (yield isCrbtOpening({ req })) {
          result.crbt = {
            code: 31,
            msg: '彩铃功能开通中，请耐心等待！'
          }
        } else {
          result.crbt = { code: 30 }
          if (orderState !== undefined) {
            result.order = { code: orderState ? 1 : 20 }
          }
        }
      } else {
        // 正常开通
        yield checkCode({ req, data: { phone, checkcode } })
        yield login({ req, data: { userinfo: phone, type: 2 } })
        result.user = current.user
        let orderState
        // 合并弹窗=合并开通，检查会员状态
        if (spconfig.order.pop.pop == 2) {
          orderState = yield isOrder({ req })
        }
        // open crbt
        if (yield isCrbt({ req })) {
          result.crbt = { code: 1 }
          if (orderState === undefined) {
            result.order = {code: orderState ? 1 : 20}
          }
        } else {
          if (yield isCrbtOpening({ req })) {
            result.crbt = {
              code: 31,
              msg: '彩铃功能开通中，请耐心等待！'
            }
          } else {
            try {
              yield openCrbt({ req })
            } catch (err) {
              result.crbt = {
                code: -31,
                msg: err
              }
              return result
            }
            if (yield isCrbtOpening({ req })) {
              result.crbt = {
                code: 31,
                msg: '彩铃功能开通中，请耐心等待！'
              }
            } else {
              result.crbt = {code: 30}
              if (orderState === undefined) {
                result.order = {code: orderState ? 1 : 20}
              }
            }
          }
        }
      }

      return result
    }
    // 普通登录
    yield checkCode({ req, data: { phone, checkcode } })
    yield login({ req, data: { userinfo: phone.replace(/^(\\+)?(86)?/, ''), type: 2 } })
    return {
      type: 1,
      user: current.user
    }
  })

  next()
}
