global.Promise = require('bluebird')
Promise.config({ warnings: false })
const config = require('./config')
const path = require('path')
const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('./middlewares/session')
const current = require('./middlewares/current')
const trace = require('./middlewares/trace')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(compression({
  filter: (req, res) => /javascript|css/i.test(res.get('Content-Type')),
  level: 6
}))

app.use(express.static(path.join(__dirname, 'public'), config.static));
app.use('/static', express.static(path.join(__dirname, './views/m/static'), config.static));

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session())

// index页面路由
const index = require('./routes/index')
app.use('/', index)

// current中间件
app.use(current())
// trace中间件
app.use(trace())

// h5页面路由
const mindex = require('./routes/m-index')
app.use('/m/', mindex)

// 接口路由
const api = require('./api')
app.use('/api', api)

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
// error
app.use(function(err, req, res, next) {
  const status = err.status || 500
  res.status(status)
  res.send({
    code: status,
    msg: err.message
  })
})

app.listen(config.port)
