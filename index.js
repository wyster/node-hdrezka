const config = require("./utils/config")
const fastify = require("fastify")({
    logger: true
})
config.load()

fastify.register(require('fastify-cors'))
fastify.register(require("./routes"))

fastify.listen(process.env.PORT || 80, '0.0.0.0', (err, address) => {
    if (err) throw err
})