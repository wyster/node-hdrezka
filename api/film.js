const http = require('../utils/http')
const { parseUri } = require('../utils/helper')
const FormData = require('form-data')

function getPlayer ({ id, translator_id }) {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('id', parseInt(id));
    formData.append('translator_id', parseInt(translator_id))
    formData.append('action', 'get_movie');

    const response = await http.HDRezkaClient.post(`ajax/get_cdn_series/?t=${Date.now()}`, { body: formData, responseType: 'json' }).catch(e => { reject(e) });
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