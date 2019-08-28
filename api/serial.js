const http = require("../utils/http")
const $ = require("cheerio")
const player = require("./player")

async function parseSeasons(HTML, _callback) {
    let seasons = []
    $(HTML).each((_, season) => {
        seasons.push({
            title : $(season).text(),
            id    : $(season).attr("data-tab_id")
        })
    })
    _callback(seasons)
}

async function parseEpisodes(HTML, _callback) {
    let episodes = []
    $(HTML).children().each((_, episodes_info) => {
        episodes.push({
            title      : $(episodes_info).text(),
            episode_id : $(episodes_info).attr("data-episode_id"),
            season_id  : $(episodes_info).attr("data-season_id")
        })
    })
    _callback(episodes)
}

async function parseSerial(url, translator_id, _callback) {
    let seasons   = []
    let episodes  = []
    let media     = []
    let playerUri = null

    // Есть есть озвучки, сезоны и сериалы
    if (translator_id != "") {
        let post_id = url.match(/\d+/g)[0]
        let options = {
            json : true,
            form : true,
            body : {
                id : parseInt(post_id),
                translator_id : translator_id
            }
        }
        http.HDRezkaClient.post(`/ajax/get_cdn_series/?t=${Date.now()}`, options).then((response) => {
            parseSeasons(response.body["seasons"], (result) => {
                seasons = result
            })
            parseEpisodes(response.body["episodes"], (result) => {
                episodes = result
            })
            playerUri = response.body["url"]

            media = {
                seasons  : seasons,
                episodes : episodes,
                uri      : playerUri
            }

            _callback(media)
        })
    }

    // Есть нет озвучки, но есть сезоны и эпизоды
    if (translator_id == "") {
        http.DefaultClient.get(url).then((response) => {
            let seasonsHTML = $(response.body).find("ul#simple-seasons-tabs").html()
            let episodesHTML = $(response.body).find("div#simple-episodes-tabs").html()
            parseSeasons(seasonsHTML, (result) => {
                seasons = result
                seasons.shift()
                seasons.pop()
            })
            parseEpisodes(episodesHTML, (result) => {
                episodes = result
            })
            player.prepareURI(response.body, (result) => {
                playerUri = result
            })

            media = {
                seasons  : seasons,
                episodes : episodes,
                uri      : playerUri
            }

            _callback(media)
        })
    }
}

module.exports = parseSerial