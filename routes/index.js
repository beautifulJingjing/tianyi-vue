const express = require('express')

const router = express.Router()

router
  // 根目录去下载页
  .get('/', (req, res, next) => {
    res.redirect('/download')
  })
  // 下载页
  .get('/download/*', (req, res, next) => {
    if (/Mobile/gi.test(req.headers['user-agent'])) {
      res.render('download/m/index')
    } else {
      res.render('download/w/index')
    }
  })

module.exports = router
