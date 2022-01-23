const http = require('../utils/http')
const { parseUri } = require('../utils/helper')
const FormData = require('form-data')

async function getPlayer ({ id, translator_id }) {
  const formData = new FormData();
  formData.append('id', parseInt(id));
  formData.append('translator_id', parseInt(translator_id))
  formData.append('action', 'get_movie');

  const response = await http.HDRezkaClient.post(`ajax/get_cdn_series/?t=${Date.now()}`, { body: formData, responseType: 'json' }).catch(e => { throw e})
  if (!response.body.success) {
    throw new Error(response.body.message)
  }

  return {
    uri: parseUri(response.body['url'])
  }
}

module.exports = {
  getPlayer
}
