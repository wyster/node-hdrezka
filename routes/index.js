const Sentry = require("@sentry/node");
const api = require('../api')
const { getIdFromUrl } = require('../utils/helper')

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

async function routes (fastify) {
  fastify.get('/posts', (request, reply) => {
    let type = request.query.type
    let page = request.query.page
    let filter = request.query.filter
    api.posts(type, page, filter, (result) => reply.send(result))
  })
  fastify.get('/details', async (request, reply) => {
    try {
      const result = await api.details.parseDetails(request.query.id).catch(e => { throw e })
      reply.send(result)
    } catch (e) {
      Sentry.captureException(e)
      reply.code(500).send()
    }
  })
  fastify.get('/movie/player', async (request, reply) => {
    try {
      const result = await api.film.getPlayer({ id, translator_id } = request.query)
      reply.send(result)
    } catch (e) {
      Sentry.captureException(e)
      reply.code(500).send()
    }
  })
  fastify.get('/serial', async (request, reply) => {
    try {
      const result = await api.serial.getInfo({ id } = request.query)
      reply.send(result)
    } catch (e) {
      Sentry.captureException(e)
      reply.code(500).send()
    }
  })
  fastify.get('/serial/player', async (request, reply) => {
    try {
      const result = await api.serial.getPlayer({ id, translator_id, episode, season } = request.query)
      reply.send(result)
    } catch (e) {
      Sentry.captureException(e)
      reply.code(500).send()
    }
  })
  fastify.get('/serial/episodes', async (request, reply) => {
    try {
      const result = await api.serial.getEpisodes({ id, translator_id } = request.query)
      reply.send(result)
    } catch (e) {
      Sentry.captureException(e)
      reply.code(500).send()
    }
  })
  fastify.get('/search', async (request, reply) => {
    try {
      const result = await api.details.search(request.query.q)
      reply.send(result)
    } catch (e) {
      Sentry.captureException(e)
      reply.code(500).send()
    }
  })
  fastify.get('/id-from-url', (request, reply) => {
    reply.send({ id: getIdFromUrl(request.query.url) })
  })
}

module.exports = routes