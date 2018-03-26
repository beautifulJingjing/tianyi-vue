const express = require('express')
const router = express.Router()
const { checkLogin } = require('./auth')
const home = require('./home')
const user = require('./user')
const activity = require('./activity')

// 站点内容相关
router
  .get('/getRingList', home.getRingList)
  .get('/getParts', home.getParts)
  .get('/getSearch', home.getSearch)
  .get('/getSearchkey', home.getSearchkey) // 没用到
  .post('/feedback', home.feedback)
  .post('/log', home.log)
  
// 用户相关
router
  .get('/comkey', user.comkey)
  .post('/login', user.login)
  .get('/checkOrder', user.checkOrder) // 没用到
  .get('/clearCache', user.clearCache) // 没用到
  .get('/audition.mp3', user.audition)
  .post('/getCheckCode', user.getCheckCode)
  .get('/checkCrbt', checkLogin, user.checkCrbt) // 没用到
  .get('/checkOnFreeCrbt', user.checkOnFreeCrbt) // 没用到
  .get('/checkServe', user.checkServe) // 没用到
  .post('/openOrder', checkLogin, user.openOrder)
  .post('/openCrbt', checkLogin, user.openCrbt)
  .post('/setServe', checkLogin, user.setServe)
  .post('/setRing', checkLogin, user.setRing)
  .get('/getRingDownUrl', user.getRingDownUrl)
  .post('/offOrder', user.offOrder)

// 活动相关
router
  .get('/getActs', activity.getActs) // 没用到
  .get('/getReceiveNum', activity.getReceiveNum)
  .post('/getLottery', activity.getLottery)
  .get('/getLotteryNum', activity.getLotteryNum)
  .get('/getLotteryLog', activity.getLotteryLog)

// 统一处理返回
router.all('*', (req, res) => {
  const p = res.locals.p
  if (p) {
    p.then(ret => {
      res.send({
        s: 1,
        data: ret
      })
    }).catch(err => {
      res.send({
        s: 0,
        msg: typeof err === 'object' ? err.message : err
      })
    })
  } else {
    res.send(404)
  }
})

module.exports = router
