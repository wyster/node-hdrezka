const http = require('../utils/http')
const $ = require('cheerio')
const { parseUri } = require('./helper')

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

async function getInfo ({ url }, _callback) {
  return new Promise(async (resolve, reject) => {
    const response = await http.DefaultClient.get(url)
    const $body = $(response.body)

    resolve({
      translators: await prepareTranslators($body)
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
    let options = {
      json: true,
      form: true,
      body: {
        id: parseInt(id),
        translator_id: parseInt(translator_id),
        action: 'get_stream',
        episode: parseInt(episode),
        season: parseInt(season)
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

function getEpisodes ({ id, translator_id }) {
  return new Promise((resolve, reject) => {
    let seasons = []
    let episodes = []
    let media = []

    let options = {
      json: true,
      form: true,
      body: {
        id: parseInt(id),
        translator_id: parseInt(translator_id),
        action: 'get_episodes',
      }
    }
    http.HDRezkaClient.post(`/ajax/get_cdn_series/?t=${Date.now()}`, options).then((response) => {
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
  })
}

module.exports = {
  getInfo,
  getEpisodes,
  getPlayer
}