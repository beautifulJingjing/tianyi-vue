const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const isProd = process.env.NODE_ENV === 'production'

console.log(`环境：`, process.env.NODE_ENV)

module.exports = {
  isDev,
  isProd,
  port: isDev ? 3000 : process.env.PORT,
  spinfocode: '020004',
  static: {
    maxAge: 3600 * 1000
  },
  redis: isDev
    ? `redis://127.0.0.1:6379/0`
    : isTest
      ? `redis://127.0.0.1:6379?db=4&password=e63822fc1f729bef17a0fae26d1f9fbd83709c35790402ad26b4a3b4fe84fbf2`
      : `redis://10.117.15.79:6379?db=4`
}
