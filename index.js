const config = require("./utils/config")
const fastify = require("fastify")({
    logger: true
})
config.load()

fastify.register(require("./routes"))

fastify.listen(process.env.API_PORT, process.env.API_HOST, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
})