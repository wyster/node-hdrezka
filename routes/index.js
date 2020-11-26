const api = require("../api")

async function routes (fastify, options) {
    fastify.get("/posts", (request, reply) => {
        let type   = request.query.type
        let page   = request.query.page
        let filter = request.query.filter
        api.posts(type, page, filter, (result) => reply.send(result))
    })
    fastify.get("/details", (request, reply) => {
        let url = request.query.url
        api.details(url, (result) => reply.send(result))
    })
    fastify.get("/movie/player", async (request, reply) => {
        const result = await api.movie.getPlayer({id, translator_id} = request.query);
        reply.send(result);
    })
    fastify.get("/serial", async (request, reply) => {
        const result = await api.serial.getInfo({url} = request.query);
        reply.send(result);
    })
    fastify.get("/serial/player", async (request, reply) => {
        const result = await api.serial.getPlayer({id, translator_id, episode, season} = request.query);
        reply.send(result);
    })
    fastify.get("/serial/episodes", async (request, reply) => {
        const result = await api.serial.getEpisodes({id, translator_id} = request.query);
        reply.send(result);
    })
}

module.exports = routes