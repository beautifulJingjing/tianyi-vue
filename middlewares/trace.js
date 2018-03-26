/**
 * 日志中间件
 * 依赖：current中间件
 */
const logger = require('../utils/logger')('trace')
const moment = require('moment')
const querystring = require('querystring')
const url = require('url')

function log(
  req, 
  tracename, 
  { 
    remark = '', 
    user, 
    eventname,
    eventparams,
    explain,
  } = {}
) {
  const now = moment()
  const query = Object.assign({}, req.query, req.body)

  user = user || req.current.user || {}

  const d = {
    date: now.format('YYYY/MM/DD'),
    time: now.format('HH:mm:ss'),
    spinfocode: req.current.spinfocode,
    tracename,
    sessionID: req.sessionID || '',
    uid: user.id || '',
    phone: user.phone || '',
    weixinid: user.weixinid || '',
    eventname: eventname || query.name || '',
    eventparams: (eventparams || query.params || '').replace(/\r\n/g, ' '),
    explain: (explain || query.msg || '').replace(/\r\n/g, ' '),
    comkey: req.current.comkey || '',
    /**
     * 网络类型
     * 返回值 QQ返回值   类型
     * 0    unknown UNKNOW
     * 1    ethernet ETHERNET
     * 2    wifi WIFI
     * 3    2g CELL_2G
     * 4    3g CELL_3G
     * 5    4g CELL_4G（中国现在也会出现这个值，是hspa+）
     * ?    none NONE
     */
    networktype: query.network || '',
    comkeyStatus: req.current.comkeyStatus || '',
    url: `${url.parse(req.originalUrl).pathname}?${querystring.stringify(query)}`,
    referer: req.headers.referer || query.referer || '',
    ip: req.current.ip,
    remark: remark.replace(/\r\n/g, ' '),
  }

  logger.info(`${d.date} ${d.time}\t${d.spinfocode}\t${d.tracename}\t${d.sessionID}\t${d.uid}\t${d.phone}\t${d.weixinid}\t${d.eventname}\t${d.eventparams}\t${d.explain}\t${d.comkey}\t${d.networktype}\t${d.comkeyStatus}\t${d.url}\t${d.referer}\t${d.ip}\t${d.remark}`)
}

function paramsStr(params) {
  return (typeof params === 'object') ? querystring.stringify(params) : params
}
function stringify(item) {
  return (typeof item === 'object') ? JSON.stringify(item) : item
}

module.exports = () => {
  return (req, res, next) => {
    req.trace = {
      // PV访问
      pv() {
        log(req, 'pv', {
          remark: req.headers['user-agent']
        })
      },
      // 访问跟踪=Visit
      visit() {
        if (req.current.visit) return
        
        req.current.visit = true
        log(req, 'Visit', {
          remark: req.headers['user-agent']
        })
      },
      // 透传跟踪=Unikey
      // option={phone: null}
      comkey({ phone } = {}) {
        log(req, 'Unikey', {
          user: phone && { phone }
        })
      },
      // 动作日志=Event
      // option={user: 用户信息, name: 事件名, params: 事件参数}
      event({ user, name, params } = {}) {
        log(req, 'Event', {
          user,
          eventname: name,
          eventparams: paramsStr(params)
        })
      },
      // 接口日志=Interface
      // option={user: 用户信息, name: 接口名, params: 接口参数}
      interface({ user, name, params } = {}) {
        log(req, 'Interface', {
          user,
          eventname: name,
          eventparams: paramsStr(params)
        })
      },
      // 错误日志=Error
      // option={user: 用户信息, name: 接口名, params: 接口参数, msg: 错误信息}
      error({ user, name, params, msg, message } = {}) {
        log(req, 'Error', {
          user,
          eventname: name,
          eventparams: paramsStr(params),
          explain: stringify(msg || message)
        }) 
      },
      // 其它日志=Other
      // option={user: 用户信息, name: 事件名, params: 事件参数, msg: 附加信息}
      other({ user, name, params, msg } = {}) {
        log(req, 'Other', {
          user,
          eventname: name,
          eventparams: paramsStr(params),
          explain: stringify(msg)
        })
      }
    }
    next()
  }
}
