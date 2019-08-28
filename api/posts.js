const http = require("../utils/http")
const $ = require("cheerio")

async function parsePosts(type, page, filter, _callback) {
    let posts = []
    let result = {}
    http.HDRezkaClient.get(`/${type}/page/${[page]}/?filter=${filter}`).then((response) => {
        $("div.b-content__inline_items", response.body).children().each((_, element) => {
            let data_url = $(element).attr("data-url")
            let img = $(element).find(".b-content__inline_item-cover a img").attr("src")
            let title = $(element).find(".b-content__inline_item-link a").text()
            let subtitle = $(element).find(".b-content__inline_item-link div").text()
            img = process.env.HTTP_HDREZKA_HOST + img
            posts.push({
                data_url  : data_url,
                img      : img,
                title    : title,
                subtitle : subtitle
            })
        })
        posts.pop()
        result["posts"] = posts
        _callback(result)
    })
}

module.exports = parsePosts