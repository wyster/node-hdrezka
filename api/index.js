const posts = require('./posts')
const details = require('./details')
const serial = require('./serial')
const player = require('./player')

module.exports = { parsePosts: posts, parseDetails: details, parseSerial: serial, preparePlayer: player.prepareURI }