const http = require('../utils/http')
const $ = require('cheerio')
const { parseUri } = require('../utils/helper')
const FormData = require('form-data')

async function parseSeasons ($seasons, _callback) {
  let seasons = []
  $seasons.each((_, season) => {
    seasons.push({
      title: $(season).text(),
      id: $(season).attr('data-tab_id')
    })
  })
  _callback(seasons)
}

async function parseEpisodes ($episodes, _callback) {
  let episodes = []
  $episodes.children().each((_, episodes_info) => {
    episodes.push({
      title: $(episodes_info).text(),
      episode: $(episodes_info).attr('data-episode_id'),
      season: $(episodes_info).attr('data-season_id')
    })
  })
  _callback(episodes)
}

async function getInfo ({ id }, _callback) {
  return new Promise(async (resolve, reject) => {
    const response = await http.HDRezkaClient.get(`${id}-.html`).catch(e => { throw e })
    const $body = $(response.body)

    resolve({
      translators: await prepareTranslators($body).catch(e => { throw e })
    })
  })
}

function prepareTranslators ($body) {
  const translators = []
  $('#translators-list', $body).children().each((_, translators_info) =>
    translators.push({
      title: $(translators_info).text(),
      id: $(translators_info).attr('data-translator_id'),
      uri: $(translators_info).attr('data-cdn_url')
    })
  )
  return Promise.resolve(translators)
}

function getPlayer ({ id, translator_id, episode, season }) {
  return new Promise(async (resolve, reject) => {
    const data = {
      id: parseInt(id),
      translator_id: parseInt(translator_id),
      action: 'get_stream',
      episode: parseInt(episode),
      season: parseInt(season)
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
      return reject(response.body.message)
    }

    resolve({
      uri: parseUri(response.body['url'])
    })
  })
}

function getEpisodes ({ id, translator_id }) {
  return new Promise(async (resolve, reject) => {
    let seasons = []
    let episodes = []
    let media = []

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
      return reject(response.body.message)
    }
    parseSeasons($(response.body['seasons']), (result) => {
      seasons = result
    })
    parseEpisodes($(response.body['episodes']), (result) => {
      episodes = result
    })

    media = {
      seasons: seasons,
      episodes: episodes
    }

    resolve(media)
  })
}

module.exports = {
  getInfo,
  getEpisodes,
  getPlayer
}