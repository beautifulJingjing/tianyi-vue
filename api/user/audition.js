/**
 * 播放地址
 */

const co = require('co')
const get_fileurllist = require('../interfaces/get_fileurllist')

module.exports = (req, res, next) => {
  const { rid, type = 1, source = 1, only = 1 } = req.query

  // res.locals.p = co(function * () {
  //   let ret = null
  //   try {
  //     ret = yield get_fileurllist({ req, data: { ringid: rid, source, type, only } })
  //   } catch (err) {
  //     return ''
  //   }
  //   const url = ret.find(item => item.type == 1).url
  //   return url || ''
  // })

  // next()

  co(function * () {
    let ret = null
    try {
      ret = yield get_fileurllist({ req, data: { ringid: rid, source, type, only } })
    } catch (err) {
      return res.send('')
    }
    const url = ret.find(item => item.type == 1).url
    if (url) {
      return res.redirect(url)
    }
    res.send('')
  })
}
