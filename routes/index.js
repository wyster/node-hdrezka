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
        var url = request.query.url
        api.parseSerial(url, (result) => reply.send(result))
    })
    fastify.get('/player/prepared-uri', (request, reply) => {
        var url     = request.query.url,
            season  = request.query.season,
            episode = request.query.episode
        api.preparePlayer(url, season, episode, (result) => reply.send(result))
    })
    fastify.get('/player/hls', (request, reply) => {

    })
    fastify.get('/player/dash', (request, reply) => {

    })
}

module.exports = routes