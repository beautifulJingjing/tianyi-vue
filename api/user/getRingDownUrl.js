/**
 * Created by XUER on 2016-3-6.
 * 获取下载地址
 */

const co = require('co')
const { _checkLogin } = require('../auth')
const openCrbtCheck = require('../common/openCrbtCheck')
const openOrderCheck = require('../common/openOrderCheck')
const isCrbtFreeSupport = require('../common/isCrbtFreeSupport')
const get_fileurllist = require('../interfaces/get_fileurllist')

module.exports = (req, res, next) => {
  let { rid, source = 1, type = 1 } = req.query
  const current = req.current
  const spconfig = current.config

  res.locals.p = (() => {
    if (isNaN(rid)) {
      return Promise.reject('无效的铃声ID！')
    }
    rid = parseInt(rid)
    source = parseInt(source)
    type = parseInt(type)

    return co(function * () {
      // reject直接返回 resolve进入getUrl模式
      // 免费
      if (spconfig.downring.serve == 0) {
        return {}
      }
      try {
        yield _checkLogin(req)
      } catch (err) {
        return Promise.reject(err)
      }
      if (spconfig.downring.serve == 2) {
        let crbtcheck = null
        try {
          crbtcheck = yield openCrbtCheck({ req })
        } catch (err) {
          return Promise.reject(err)
        }
        let ordercheck = null
        try {
          ordercheck = yield openOrderCheck({ req })
        } catch(err) {
          const result = Object.assign({}, err, crbtcheck)
          if (spconfig.crbt.mode == 2) {
            const isfree = yield isCrbtFreeSupport({ req })
            return Promise.reject(isfree ? result : { code: -33, msg: '非常抱歉，您的手机号暂时不能参加本次活动！' })
          }
          return Promise.reject(result)
        }
        return Object.assign({}, crbtcheck, ordercheck)
      }
      try {
        yield openOrderCheck({ req })
      } catch (err) {
        return Promise.reject(err)
      }
      return {}
    }).then(ret => co(function * () {
      if (source == 100 || source == 101) {
        return { code: 0, msg: 'DIY铃声下载代码未实现' }
      }
      let urls = null
      try {
        urls = yield get_fileurllist({ req, data: { ringid: rid, source, type } })
      } catch (err) {
        return { code: 0, msg: err }
      }
      const url = urls ? urls.find(item => item.type == 2) : null
      if (url) {
        return { code: 1, data: url.url }
      }
      return { code: 0, msg: '获取地址失败！' }
    })).catch(err => err)
  })()
  next()
}
