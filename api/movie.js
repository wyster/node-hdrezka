const http = require('../utils/http')
const { parseUri } = require('./helper')

function getPlayer ({ id, translator_id }) {
  return new Promise(async (resolve, reject) => {
    let options = {
      json: true,
      form: true,
      body: {
        id: parseInt(id),
        translator_id: parseInt(translator_id),
        action: 'get_movie',
      }
    }
    const response = await http.HDRezkaClient.post(`/ajax/get_cdn_series/?t=${Date.now()}`, options)
    if (!response.body.success) {
      return reject(response.body.message)
    }

    resolve({
      uri: parseUri(response.body['url'])
    })
  })
}

module.exports = {
  getPlayer
}