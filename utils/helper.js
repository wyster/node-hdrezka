function parseUri (uri) {
  const regexp = /\[(.*?)](.*?) or (.*?)(?:,|$)/gm

  const matches = [...uri.matchAll(regexp)]
  return matches.map(match => {
    return {
      quality: match[1],
      playlist: match[2],
      video: match[3]
    }
  })
}

function getIdFromUrl (url) {
  return parseInt(url.match(/\d+/g)[0])
}

function buildUrlToPageById (id) {
  return `${id}-page.html`;
}

module.exports = {
  parseUri,
  getIdFromUrl,
  buildUrlToPageById
}
