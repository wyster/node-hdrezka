const { HttpsProxyAgent } = require('hpagent');
const $ = require('cheerio')
const FormData = require('form-data')
const http = require('../utils/http')
const { parseUri, buildUrlToPageById } = require('../utils/helper')

async function parseSeasons ($seasons, _callback) {
  let seasons = []
  $seasons.each((_, season) => {
    seasons.push({
      title: $(season).text(),
      id: parseInt($(season).attr('data-tab_id'))
    })
  })
  _callback(seasons)
}

async function parseEpisodes ($episodes, _callback) {
  let episodes = []
  $episodes.children().each((_, episodes_info) => {
    episodes.push({
      title: $(episodes_info).text(),
      episode: parseInt($(episodes_info).attr('data-episode_id')),
      season: parseInt($(episodes_info).attr('data-season_id'))
    })
  })
  _callback(episodes)
}

async function getInfo ({ id }, _callback) {
  const response = await http.HDRezkaClient.get(buildUrlToPageById(id)).catch(e => { throw e })
  const $body = $(response.body)

  return {
    translators: await prepareTranslators($body).catch(e => { throw e })
  }
}

function prepareTranslators ($body) {
  const translators = []
  $('#translators-list', $body).children().each((_, translators_info) =>
    translators.push({
      title: $(translators_info).text(),
      id: parseInt($(translators_info).attr('data-translator_id')),
      uri: $(translators_info).attr('data-cdn_url')
    })
  )
  return Promise.resolve(translators)
}

async function getPlayer ({ id, translator_id, episode, season }) {
  const data = {
    id: parseInt(id),
    translator_id: parseInt(translator_id),
    action: 'get_stream',
    episode: parseInt(episode),
    season: parseInt(season),
  }
  const formData = new FormData()
  Object.entries(data).forEach(item => {
    formData.append(item[0], item[1])
  })
  const params = {
    body: formData,
    responseType: 'json'
  }
  const response = await http.HDRezkaClient.post(`ajax/get_cdn_series/?t=${Date.now()}`, params).catch(e => { throw e })
  if (!response.body.success) {
    throw new Error(response.body.message);
  }

  if (typeof response.body['url'] !== 'string') {
    throw new Error('url is not string, response: ' + JSON.stringify(response.body));
  }

  return {
    uri: parseUri(response.body['url'])
  }
}

async function getEpisodes ({ id, translator_id }) {
  let seasons = []
  let episodes = []

  const data = {
    id: parseInt(id),
    translator_id: parseInt(translator_id),
    action: 'get_episodes'
  }
  const formData = new FormData()
  Object.entries(data).forEach(item => {
    formData.append(item[0], item[1])
  })
  const response = await http.HDRezkaClient.post(`ajax/get_cdn_series/?t=${Date.now()}`, {
    body: formData,
    responseType: 'json'
  }).catch(e => { throw e })
  if (!response.body.success) {
    throw new Error(response.body.message)
  }
  parseSeasons($(response.body['seasons']), (result) => {
    seasons = result
  })
  parseEpisodes($(response.body['episodes']), (result) => {
    episodes = result
  })

  return {
    seasons: seasons,
    episodes: episodes
  }
}

module.exports = {
  getInfo,
  getEpisodes,
  getPlayer
}
