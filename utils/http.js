const got = require('got')

const HDRezkaClient = got.extend({
	baseUrl: process.env.HTTP_HDREZKA_HOST,
	headers: {
        'User-Agent' : process.env.HTTP_HEADERS,
		'Referer'    : process.env.HTTP_HDREZKA_HOST
	}
});

const DefaultClient = got.extend({
	headers: {
        'User-Agent' : process.env.HTTP_HEADERS
	}
});

module.exports = {HDRezkaClient, DefaultClient}
