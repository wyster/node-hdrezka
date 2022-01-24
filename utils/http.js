const got = require('got')

const HDRezkaClient = got.extend({
  prefixUrl: process.env.HTTP_HDREZKA_HOST,
  headers: {
    'User-Agent': process.env.HTTP_HEADERS,
    'Referer': process.env.HTTP_HDREZKA_HOST
  },
  timeout: 10 * 1000,
  https: { rejectUnauthorized: false }
})

const DefaultClient = got.extend({
  headers: {
    'User-Agent': process.env.HTTP_HEADERS
  },
  timeout: 5 * 1000
})

module.exports = { HDRezkaClient, DefaultClient }
