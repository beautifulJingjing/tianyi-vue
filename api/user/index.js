/**
 * 用户相关接口
 */

module.exports = {
  comkey: require('./comkey'),
  login: require('./login'),
  checkOrder: require('./checkOrder'),
  clearCache: require('./clearCache'),
  audition: require('./audition'),
  getCheckCode: require('./getCheckCode'),
  checkCrbt: require('./checkCrbt'),
  checkOnFreeCrbt: require('./checkOnFreeCrbt'),
  checkServe: require('./checkServe'),
  openOrder: require('./openOrder'),
  openCrbt: require('./openCrbt'),
  setServe: require('./setServe'),
  setRing: require('./setRing'),
  getRingDownUrl: require('./getRingDownUrl'),
  offOrder: require('./offOrder'),
}
