const got = require('got')

const HDRezkaClient = got.extend({
	baseUrl: process.env.HOST,
	headers: {
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0',
		'Referer'    : 'http://hdrezka.loan'
	}
});

const DefaultClient = got.extend({
	headers: {
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0'
	}
});

module.exports = {HDRezkaClient, DefaultClient}
