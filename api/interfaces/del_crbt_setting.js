/**
 * del_crbt_setting
 * data {}
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'del_crbt_setting'
  return request({ req, data })
}
