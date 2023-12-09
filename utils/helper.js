function decodeUri (uri) {
  var v = {
    bk0: "$$#!!@#!@##",
    bk1: "^^^!@##!!##",
    bk2: "####^!!##!@@",
    bk3: "@@@@@!##!^^^",
    bk4: "$$!!@$$@^!@#$$@",
    file2_separator: ";",
    file3_separator: "//_//",
    file_separator: ",",
  };

  var a;
  a = uri.substring(2);
  for (var i = 4; i > -1; i--) {
    if (v["bk" + i] && v["bk" + i] !== '') {
      a = a.replace(v.file3_separator + b1(v["bk" + i]), "");
    }
  }
  try {
    a = b2(a);
  } catch (e) {
    a = "";
  }

  function b1(str) {
    var btoa = require('btoa');
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,

      function toSolidBytes(match, p1) {
        return String.fromCharCode("0x" + p1);
      }

    ));
  }

  function b2(str) {
    var atob = require('atob');
    return decodeURIComponent(atob(str).split("").map(function (c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  }
  return a;
}

function parseUri (uri) {
  const regexp = /\[(.*?)](.*?) or (.*?)(?:,|$)/gm

  const matches = [...decodeUri(uri).matchAll(regexp)]
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
