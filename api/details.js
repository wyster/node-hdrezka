const http = require('../utils/http')
const $ = require('cheerio')
const FormData = require('form-data')
const { getIdFromUrl } = require('../utils/helper')

async function parseDetails (id) {
  let details = {}
  let rating = []
  let translators = []
  let slogan = null
  let release_date = null
  let country = null
  let director = null
  let genre = null
  let age_limit = null
  let duration = null
  let description = null
  let playerUri = null
  let isSerial = false

  const response = await http.HDRezkaClient.get(`${id}-.html`).catch(e => { throw e})

  $(response.body).find('table.b-post__info tbody').children().each((_, post_info) => {
    let info_key = $(post_info).find('td.l h2').text()

    if (info_key == 'Рейтинги') {
      $(post_info).find('td').eq(1).find('span.b-post__info_rates').each((_, rating_info) => {
        let name = $(rating_info).find('a').text()
        let score = $(rating_info).find('span').text()
        let count = $(rating_info).find('i').text().replace(/[()]/g, '')
        rating.push({
          name: name,
          score: score,
          count: count
        })
      })
    }

    if (info_key == 'Слоган') {
      slogan = $(post_info).find('td').eq(1).text()
    }

    if (info_key == 'Дата выхода') {
      release_date = $(post_info).find('td').eq(1).text()
    }

    if (info_key == 'Страна') {
      country = $(post_info).find('td').eq(1).text()
    }

    if (info_key == 'Режиссер') {
      director = $(post_info).find('td').eq(1).find('div span span a span').text()
    }

    if (info_key == 'Жанр') {
      genre = $(post_info).find('td').eq(1).find('a span').map((_, genre_info) => {
        return $(genre_info).text()
      }).get().join(', ')
    }

    if (info_key == 'Возраст') {
      age_limit = $(post_info).find('td').eq(1).find('span').text()
    }

    if (info_key == 'Время') {
      duration = $(post_info).find('td').eq(1).text()
    }
  })

  description = $(response.body).find('div.b-post__description_text').text().trim()

  $('#translators-list', response.body).children().each((_, translators_info) =>
    translators.push({
      title: $(translators_info).text(),
      id: $(translators_info).attr('data-translator_id'),
      uri: $(translators_info).attr('data-cdn_url')
    })
  )

  if ($(response.body).find('ul').hasClass('b-simple_seasons__list') && $(response.body).find('ul').hasClass('b-simple_episodes__list')) {
    isSerial = true
  }

  if (translators.length == 0 && !isSerial) {
    /*player.parseURI(response.body, (uri) => {
      playerUri = uri
    })*/
  }

  return {
    rating: rating,
    slogan: slogan,
    release_date: release_date,
    country: country,
    director: director,
    genre: genre,
    age_limit: age_limit,
    duration: duration,
    description: description,
    translators: translators,
    isSerial: isSerial,
    playerUri: playerUri,
    name: $(response.body).find('.b-post__title').text().trim()
  }
}

async function search (q) {
  const formData = new FormData()
  formData.append('q', q)
  const options = {
    body: formData
  }
  const response = await http.HDRezkaClient.post('engine/ajax/search.php', options).catch(e => { throw e })

  const $body = $(response.body)
  const results = []
  $('.b-search__section_list', $body).children().each((_, item) => {
    const $item = $(item)
    const link = $item.find('a').attr('href')
    const id = getIdFromUrl(link)
    const title = $item.find('a .enty').text()
    results.push({
      id,
      title
    })
  })

  return results
}

module.exports = {
  parseDetails,
  search
}