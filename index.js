const config =require('./utils/config')
const fastify = require('fastify')({
    logger: true
})
config.load()
fastify.register(require('./routes'))

fastify.listen(3000, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
})


// The Big Bang Theory (serial with translators, seasons and episodes) = http://hdrezka.loan/series/comedy/1154-teoriya-bolshogo-vzryva-2007.html
// My Name Is Earl (serial without translators, but with seasons and episodes) = http://hdrezka.loan/series/comedy/1902-menya-zovut-erl.html
// The Godfather (film with translators) = http://hdrezka.loan/films/drama/1167-krestnyy-otec-1972.html
// Parasite (filt without translators, seasons and episodes) = http://hdrezka.loan/films/drama/31349-parazity-2019.html