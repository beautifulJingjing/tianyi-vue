const redis = require('../../utils/redis')

module.exports = (req, res, next) => {
  const { key } = req.query

  res.locals.p = redis.delAsync(key)
    .then(ret => {
      return 'clear cache ok:' + ret
    })
    .catch(err => {
      return 'clear cache fail:' + JSON.stringify(err)
    })
  next()
}
