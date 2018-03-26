/**
 * session中间件
 */

const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const client = require('../utils/redis')

module.exports = () => {
  return session({
    name: 'sessionidty',
    store: new RedisStore({ client }),
    secret: '000',
    cookie: {
      maxAge: 24 * 3600 * 1000,
    },
    saveUninitialized: false,
    resave: false,
    rolling: true,
  })
}
