const log4js = require('log4js')
const config = require('../config')
const path = require('path')
const fs = require('fs')

const logDir = path.join(__dirname, '../log')
try {
  fs.accessSync(logDir)
} catch (err) {
  fs.mkdirSync(logDir)
}

log4js.configure({
  appenders: { 
    console: {
      type: 'console',
      layout: { type: 'colored' }
    },
    trace: {
      type: 'dateFile',
      filename: path.join(logDir, '/'),
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '%m',
      }
    }
  },
  categories: {
    trace: { appenders: ['trace'], level: 'all' },
    default: { appenders: ['console'], level: 'all' }
  }
})

module.exports = category => {
  return log4js.getLogger(category)
}
