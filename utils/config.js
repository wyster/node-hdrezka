async function load(path = "../config.json") {
    const config = require(path)
    process.env.HTTP_HDREZKA_HOST = config.http.hdrezka_host
    process.env.HTTP_HEADERS = config.http.headers
    process.env.API_HOST = config.api.host
    process.env.API_PORT = config.api.port
}

module.exports = { load }