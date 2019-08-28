const $ = require("cheerio")

async function parseURI(HTML, _callback) {
    let playerUri = $(HTML).find("iframe#cdn-player").attr("src")
    playerUri = playerUri.substring(0, playerUri.indexOf("?pid"))
    _callback(playerUri)
}

async function prepareURI(uri, season, episode, _callback) {
    _callback(`${uri}?season=${season}&episode=${episode}`)
}

async function parseHLS() {
}

async function parseDASH() {
}

module.exports = {parseURI, prepareURI, parseHLS, parseDASH}