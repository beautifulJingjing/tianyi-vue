const express = require('express')

const router = express.Router()

router.get(/^\/(index[,&])?(\d*)?.html?$/i, (req, res, next) => {
  const a = req.query.a
  res.redirect(`/m/index?spinfocode=${req.params[1]}${a ? `&a=${a}` : ''}`)
})
router.get(/^\/partlist[,&]id=([-\d]*)[,&]?(\d*)?.html?$/i, (req, res, next) => {
  res.redirect(`/m/partlist?spinfocode=${req.params[1]}&id=${req.params[0]}`)
})
router.get(/^\/search[,&]key=.[^,&]*[,&]?(\d*)?.html?$/i, (req, res, next) => {
  res.redirect(`/m/search?spinfocode=${req.params[1]}`)
})
router.get(/^\/pop\/(\d+)[,&](\d*)\.html$/i, (req, res, next) => {
  const a = req.query.a
  if(req.params[1] == '02640710400051' && req.params[0] == 18) {
    res.sendStatus(404)
  } else {
    res.redirect(`/m/pop/${req.params[0]}?spinfocode=${req.params[1]}${a ? `&a=${a}` : ''}`)
  }
})
router.get(/^\/zt\/zt(\d+)\//i, (req, res, next) => {
  res.redirect(`/m/zt/${req.params[0]}${req._parsedUrl.search}`)
})
// tops search feedback userCenter help
router.get(/^\/(.+)[,&]?(\d*)?.html?$/i, (req, res, next) => {
  let pathname = req.params[0]
  if (pathname === 'userCenter') {
    pathname = 'userCenter1'
  }
  res.redirect(`/m/${pathname}?spinfocode=${req.params[1]}`)
})
router.get('*', (req, res, next) => {
  req.trace.pv()
  var hmid = '', spinfocode = req.current.spinfocode;
  if(/^\d{7}(044|066|067)/.test(spinfocode)) hmid = 'd882c0f01214a6026cfe02e034a3fb1a';
  else if(/^\d{7}031/.test(spinfocode)) hmid = '0f49056c00c92d2a7b5f5cede3b7011a';
  res.render('m/index', {
    spcode: req.current.spinfocode,
    config: req.current.config,
    hmid: hmid
  })
})

module.exports = router
