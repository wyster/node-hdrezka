const api = require("../api")

async function routes (fastify, options) {
    fastify.get("/posts", (request, reply) => {
        let type   = request.query.type
        let page   = request.query.page
        let filter = request.query.filter
        api.parsePosts(type, page, filter, (result) => reply.send(result))
    })
    fastify.get("/details", (request, reply) => {
        let url = request.query.url
        api.parseDetails(url, (result) => reply.send(result))
    })
    fastify.get("/serial", (request, reply) => {
        let url = request.query.url
        let translator_id = request.query.translator_id
        api.parseSerial(url, translator_id, (result) => reply.send(result))
    })
    fastify.get("/player/prepared-uri", (request, reply) => {
        let uri     = request.query.uri
        let season  = request.query.season
        let episode = request.query.episode
        api.preparePlayer(uri, season, episode, (result) => reply.send(result))
    })
    fastify.get("/player/hls", (request, reply) => {

    })
    fastify.get("/player/dash", (request, reply) => {

    })
}

module.exports = routes