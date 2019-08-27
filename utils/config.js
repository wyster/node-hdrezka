async function load(path = '../config.json') {
    const config = require(path)
    process.env.HOST = config.host
}

module.exports = { load }