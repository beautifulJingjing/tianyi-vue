/**
 * 验证
 */

const _checkLogin = (req) => {
  if (req.current.isLogin) {
    return Promise.resolve(true)
  }
  return Promise.reject({ code: -10001, msg: '尚未登录' })
}

exports._checkLogin = _checkLogin

exports.checkLogin = (req, res, next) => {
  _checkLogin(req)
    .then(ret => {
      next()
    })
    .catch(err => {
      res.locals.p = Promise.resolve(err)
      next('route')
    })
}
