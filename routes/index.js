const api = require('../api')

async function routes (fastify, options) {
    fastify.get('/posts', (request, reply) => {
        var type   = request.query.type,
            page   = request.query.page,
            filter = request.query.filter
        api.parsePosts(type, page, filter, (result) => reply.send(result))
    })
    fastify.get('/details', (request, reply) => {
        var url = request.query.url
        api.parseDetails(url, (result) => reply.send(result))
    })
    fastify.get('/serial', (request, reply) => {
        var url = request.query.url,
            translator_id = request.query.translator_id
        api.parseSerial(url, translator_id, (result) => reply.send(result))
    })
    fastify.get('/player/prepared-uri', (request, reply) => {
        var uri     = request.query.uri,
            season  = request.query.season,
            episode = request.query.episode
        api.preparePlayer(uri, season, episode, (result) => reply.send(result))
    })
    fastify.get('/player/hls', (request, reply) => {

    })
    fastify.get('/player/dash', (request, reply) => {

    })
}

module.exports = routes