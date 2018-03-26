/**
 * 访问密度
 */

const co = require('co')
const redis = require('./redis')

const isBusy = n => n >= 10

module.exports = {
  // 统计访问密度
  setDense: code => co(function * () {
    const key = `dense${code}`
    const { lastTime, number } = (yield redis.hgetallAsync(key)) || {}

    let denseToSet = null
    if (!lastTime) {
      denseToSet = {
        lastTime: +new Date(), 
        number: 0
      }
    } else {
      const now = +new Date()
      const diff = now - lastTime
      let newNumber = number || 0
      if (isBusy(number)) {
        // 两次访问间隔大于30分钟，退出密集模式
        if (diff > 30 * 60000) {
          newNumber = 0
        }
      } else {
        // 两次访问间隔小于15分钟，累计；大于15分钟重新累计
        if (diff < 15 * 60000) {
          newNumber = +number + 1
        } else {
          newNumber = 0
        }
      }
      denseToSet = {
        lastTime: now,
        number: newNumber
      }
    }
    yield redis.hmsetAsync(key, denseToSet)
    return denseToSet
  }),
  // 判断访问密度
  isDense: code => co(function * () {
    const { lastTime, number } = (yield redis.hgetallAsync(`dense${code}`)) || {}
    return lastTime && isBusy(number)
  }),
}
