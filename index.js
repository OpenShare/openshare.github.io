// core Node.js modules
const http = require('http'); // http client
const fs = require('fs'); // file system
const crypto = require('crypto'); // crypto

// useful npm modules that do one thing and one thing well (unix philosophy)
const routes = require('patterns')(); // http router
const st = require('ecstatic'); // static file server
const body = require('body/json'); // form body parser
// const oppressor = require('oppressor'); // gzip
const Twitter = require('node-twitter-api');
const url = require('url');
const trumpet = require('trumpet');
const has = require('has');
const cookie = require('cookie');
const rainbow = require('rainbow-code');
const level = require('level');
const concat = require('concat-stream');
const twittertext = require('twitter-text');
const db = level('db', {
	valueEncoding: 'json',
});

const cbPort = process.env.ip || '127.0.0.1';

const redis = require('redis');

const redisOpts = {
	host: '127.0.0.1',
	port: 6379,
};

const db0Opts = Object.assign({}, redisOpts, {
	db: 0,
});

const db1Opts = Object.assign({}, redisOpts, {
	db: 1,
});

const db2Opts = Object.assign({}, redisOpts, {
	db: 2,
});

const db3Opts = Object.assign({}, redisOpts, {
	db: 3,
});

const db0 = redis.createClient(db0Opts);
const db1 = redis.createClient(db1Opts);
const db2 = redis.createClient(db2Opts);
const db3 = redis.createClient(db3Opts);

db2.on('error', err => {
	console.error(err);
});

db3.on('error', err => {
	console.error(err);
});

const users = {};
const sessions = {};

const twitter = Twitter({
	consumerKey: process.env.consumerKey,
	consumerSecret: process.env.consumerSecret,
	callback: 'https://openshare.social/twitter/auth/success',
});

// server gzipped static files from the dist folder
const serve = st({
	root: 'browser/dist/',
	cache: false, // edit or delete this line for production,
	showDir: false,
	autoIndex: '/browser',
	defaultExt: 'html',
});

// routing
routes.add('GET /', (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || '');
	const isSession = cookies.session && has(sessions, cookies.session);

	if (isSession) {
		const data = sessions[cookies.session].data;

		const tr = trumpet();
		const page = fs.createReadStream('browser/index.html');

		const header = tr.select('.header__nav');
		header.setAttribute('class', 'header__nav header__nav--logged-in');

		const btn = tr.select('.header__nav-btn');
		btn.setAttribute('class', 'header__nav-item--hide');

		const avatarItem = tr.select('.header__nav-avatar');
		avatarItem.setAttribute('class', 'header__nav-item');

		const avatar = tr.select('.avatar');
		avatar.setAttribute('href', `/@${data.screen_name}`);

		const avatarImg = tr.select('.avatar__img');
		avatarImg.setAttribute('href', `/@${data.screen_name}`);
		avatarImg.setAttribute('src', data.profile_image_url_https);

		page.pipe(tr).pipe(res);
	} else {
		render('index')(req, res);
	}
});

routes.add('GET /examples', (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || '');
	const isSession = cookies.session && has(sessions, cookies.session);

	if (isSession) {
		const data = sessions[cookies.session].data;

		const tr = trumpet();
		const page = fs.createReadStream('browser/examples.html');

		const header = tr.select('.header__nav');
		header.setAttribute('class', 'header__nav header__nav--logged-in');

		const btn = tr.select('.header__nav-btn');
		btn.setAttribute('class', 'header__nav-item--hide');

		const avatarItem = tr.select('.header__nav-avatar');
		avatarItem.setAttribute('class', 'header__nav-item');

		const avatar = tr.select('.avatar');
		avatar.setAttribute('href', `/@${data.screen_name}`);

		const avatarImg = tr.select('.avatar__img');
		avatarImg.setAttribute('href', `/@${data.screen_name}`);
		avatarImg.setAttribute('src', data.profile_image_url_https);

		page.pipe(tr).pipe(res);
	} else {
		render('examples')(req, res);
	}
});

routes.add(/^GET \/@/, (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || '');
	const isSession = cookies.session && has(sessions, cookies.session);

	if (isSession) {
		const data = sessions[cookies.session].data;

		if (data.screen_name !== req.url.split('@')[1]) {
			res.writeHead(302, {
				Location: `/@${data.screen_name}`,
			});

			res.end();
		} else if (data.osapi) {
			const html = fs.createReadStream('browser/account.html');
			const keygen = fs.createReadStream('browser/components/keygen.html');
			const trHtml = trumpet();
			const trKeygen = trumpet();

			setKeyGenPage(trKeygen, data, data.osapi);

			const accountInner = trHtml.select('[data-account-setup]').createWriteStream();
			const urlInstruction = trHtml.select('[data-url-instruction]');

			urlInstruction.createWriteStream().end('Paste the URLs you want to count here');

			trKeygen.pipe(accountInner);
			keygen.pipe(trKeygen);

			setupPersonalPage(trHtml, data);

			// loop through each URL, add to input value and count to label
			data.urls.forEach((url, i) => {
				if (!url) return;

				trHtml.select(`[data-url="${i}"]`).setAttribute('value', url);
				const urlCount = trHtml.select(`[data-url-status="${i}"]`).createWriteStream();
				db0.get(url, (err, reply) => {
					if (err) console.error(err);
					urlCount.end(`
						<span class="account-form__status-link">
							${reply || 'Receiving Twitter counts. Please check back soon.'}
						</a>
					`);
				});
			});

			html.pipe(trHtml).pipe(res);
		} else {
			const tr = trumpet();
			const page = fs.createReadStream('browser/account.html');

			setupPersonalPage(tr, data);
			page.pipe(tr).pipe(res);
		}
	} else {
		res.writeHead(302, {
			Location: '/twitter/auth',
		});

		res.end();
	}
});

routes.add('GET /twitter/auth', (req, res) => {
	twitter.getRequestToken((err, token, tokenSecret) => {
		if (err) {
			console.error(err);
			error(res, err);
		} else {
			users[token] = {};
			users[token].secret = tokenSecret;

			res.writeHead(302, {
				Location: twitter.getAuthUrl(token),
			});

			res.end();
		}
	});
});

routes.add('GET /twitter/auth/success?{twitterParams}', (req, res) => {
	const params = url.parse(req.url, true).query;
	const token = params.oauth_token;
	const verifier = params.oauth_verifier;

	if (users[token]) {
		twitter.getAccessToken(
			token,
			users[token].secret,
			verifier,
			getAccessToken(req, res, token)
		);
	} else {
		res.writeHead(302, {
			Location: '/',
		});

		res.end();
	}
});

routes.add('POST /register', (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || '');

	body(req, res, (err, data) => {
		if (err) {
			console.error(err);
			res.statusCode = 404;
			res.end(`${err} \n`);
		} else {
			if (!data.appKey) data.appKey = sessions[cookies.session].data.appKey;
			if (!data.secretKey) data.secretKey = sessions[cookies.session].data.secretKey;

			const hasKeys = data.appKey && data.secretKey;
			const hasUrls = data.urls.length > 0 && data.urls.length <= 5;


			if (data.screen_name || !hasKeys || !hasUrls) {
				res.end('Data must only be consumer keys and URLs.');
			} else {
				const now = new Date().getTime()
					.toString()
					.slice(5);

				const id = crypto.randomBytes(5).toString('hex');

				const apiKey = sessions[cookies.session].data.osapi ?
					sessions[cookies.session].data.osapi :
					now + id;

				const payload = Object.assign({}, data, { osapi: apiKey });

				const userData = Object.assign({}, sessions[cookies.session].data, payload);
				sessions[cookies.session].data = userData;

				db.get(userData.screen_name, (err, value) => {
					const newData = Object.assign({}, value, userData);

					if (data.urls && value.urls) {
						const diff = value.urls.filter(i => data.urls.indexOf(i) === -1);

						diff.forEach(url => {
							db1.zrem('timestamp', url);
							db1.del(url);
							db2.del(url);
						});
					}

					db.put(userData.screen_name, newData, err => {
						if (err) {
							console.error(err);
							res.end('404');
						}
					});
				});

				const html = fs.createReadStream('browser/components/keygen.html');
				const tr = trumpet();

				setKeyGenPage(tr, data, apiKey);

				const spans = [];

				data.urls.forEach(url => {
					// loop through each URL, add to input value and count to label
					if (!url) return;

					db2.get(url, (err, reply) => {
						if (err) console.log(err);
						if (reply && reply.toString() === apiKey) {
							console.log('found', reply.toString(), apiKey);
							db0.get(url, (err, reply) => {
								if (err) console.error(err);
								spans.push(`
									<span class="account-form__status-link">
										${reply || 'Receiving Twitter counts. Please check back soon.'}
									</a>
								`);
							});
							return;
						}
						if (reply && reply.toString() !== apiKey) {
							console.log(url, 'is being used by', apiKey, reply.toString());
							spans.push(`
								<span class="account-form__status-link">
									This URL is in use with a different account.
								</span>
							`);
							return;
						}
						if (reply === null) {
							console.log(url, 'not found. adding to redis');
							spans.push(`
								<span class="account-form__status-link">
									${'Receiving Twitter counts. Please check back soon.'}
								</a>
							`);
							db2.set(url, apiKey, redis.print);
						}
					});
				});

				if (data.appKey && data.secretKey) {
					db3.set(apiKey, `${data.appKey} | ${data.secretKey}`, redis.print);
					db3.get(apiKey, (err, reply) => {
						if (err) console.log(err);
						console.log(reply.toString());
					});
				}

				html.pipe(tr).pipe(concat(html => {
					db.get(userData.screen_name, (err, value) => {
						const jsonRes = {
							body: html.toString(),
							firstTimeUser: value.firstTimeUser,
							spans,
						};

						const newData = Object.assign({}, value, {
							firstTimeUser: false,
						});

						db.put(userData.screen_name, newData, err => {
							if (err) console.error(err);
						});

						res.end(JSON.stringify(jsonRes));
					});
				}));
			}
		}
	});
});

routes.add('POST /delete', (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || '');
	const isSession = cookies.session && has(sessions, cookies.session);

	if (isSession) {
		const userData = sessions[cookies.session].data;

		db.get(userData.screen_name, (err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(302, {
					Location: '/',
				});

				res.end();
			} else {
				if (data.urls) {
					data.urls.forEach(url => {
						db1.zrem('timestamp', url);
						db1.del(url);
						db2.del(url);
					});
				}
				if (data.appKey && data.secretKey) {
					db3.del(`${data.appKey} | ${data.secretKey}`);
				}
				db.del(data.screen_name, err => {
					if (err) console.error(err);
					else {
						delete sessions[cookies.session];
						res.writeHead(302, {
							Location: '/',
						});

						res.end();
					}
				});
			}
		});
	} else {
		res.writeHead(302, {
			Location: '/',
		});

		res.end();
	}
});

routes.add(/^GET \/\?/, (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || '');
	const isSession = cookies.session && has(sessions, cookies.session);

	if (isSession) {
		const data = sessions[cookies.session].data;

		const tr = trumpet();
		const page = fs.createReadStream('browser/index.html');

		const header = tr.select('.header__nav');
		header.setAttribute('class', 'header__nav header__nav--logged-in');

		const btn = tr.select('.header__nav-btn');
		btn.setAttribute('class', 'header__nav-item--hide');

		const avatarItem = tr.select('.header__nav-avatar');
		avatarItem.setAttribute('class', 'header__nav-item');

		const avatar = tr.select('.avatar');
		avatar.setAttribute('href', `/@${data.screen_name}`);

		const avatarImg = tr.select('.avatar__img');
		avatarImg.setAttribute('href', `/@${data.screen_name}`);
		avatarImg.setAttribute('src', data.profile_image_url_https);

		page.pipe(tr).pipe(res);
	} else {
		render('index')(req, res);
	}
});

// http server
// if the request method and url is a defined route then call it's function
// else serve a static file from the dist folder, or 404
const server = http.createServer((req, res) => {
	const match = routes.match(`${req.method} ${req.url}`);

	if (match) {
		const fn = match.value;
		req.params = match.params;
		fn(req, res);
	} else serve(req, res);
});

// listen for http request on port 9090
server.listen(9090, () => {
	console.log('Server is running on http://127.0.0.1:9090');
});

function render(page) {
	return (req, res) => {
		res.setHeader('content-type', 'text/html');

		fs.createReadStream(`browser/${page}.html`)
		.pipe(res);
	};
}

function error(res, err) {
	res.statusCode = err.statusCode;
	res.end(`${err.data} \n`);
}

function verifyCreds(req, res) {
	return function verify(err, data) {
		if (err) {
			console.error(err);
			err(res, err);
		} else {
			const sid = crypto.randomBytes(64).toString('hex');
			sessions[sid] = {};
			sessions[sid].data = data;

			db.get(data.screen_name, (err, value) => {
				if (err) {
					if (err.notFound) {
						const newData = Object.assign({}, data, {
							firstTimeUser: true,
						});

						db.put(data.screen_name, newData, err => {
							if (err) {
								console.error(err);
								res.end('404', err);
							} else {
								res.setHeader('set-cookie', `session=${sid};Path=/;`);

								res.writeHead(302, {
									Location: `/@${data.screen_name}`,
								});

								res.end();
							}
						});
					} else {
						console.error(err);
						res.end('404', err);
					}
				} else {
					sessions[sid].data = value;
					res.setHeader('set-cookie', `session=${sid};Path=/;`);

					res.writeHead(302, {
						Location: `/@${data.screen_name}`,
					});

					res.end();
				}
			});
		}
	};
}

function getAccessToken(req, res, user) {
	return function accessToken(err, token, secret) {
		if (err) {
			console.error(err);
			error(res, err);
		} else {
			users[user].access = token;
			users[user].accessSecret = secret;

			twitter.verifyCredentials(token, secret, verifyCreds(req, res));
		}
	};
}

function setupPersonalPage(tr, data) {
	const avatar = tr.select('.account__avatar');
	avatar.setAttribute('src', data.profile_image_url_https
	.replace('_normal', ''));

	const username = tr.select('.account__username');
	username.createWriteStream().end(data.screen_name);

	const bio = tr.select('.account__bio');
	bio.createWriteStream().end(twittertext.autoLink(data.description));

	const header = tr.select('.account__header');
	header.setAttribute('style', `background-image: url('${data.profile_banner_url}');`);
}

function setKeyGenPage(tr, data, apiKey) {
	const highlighted = {
		js: rainbow.colorSync(
			`const OpenShare = require('openshare');
OpenShare.count({
    type: 'twitter',
    url: '${data.urls[0]}',
    key: '${apiKey}'
});`, 'javascript'
		),
		html: rainbow.colorSync(
			`<span data-open-share-count="twitter"
      data-open-share-count-url='${data.urls[0]}'
      data-open-share-key="${apiKey}"></span>`,
			'html'
		),
		key: apiKey,
	};

	const instructions = {
		js: tr.select('.account__code--js'),
		html: tr.select('.account__code--html'),
		key: tr.select('.account__spi-key'),
	};

	Object.keys(highlighted).forEach((key) => {
		if (!instructions[key]) {
			return;
		}

		instructions[key].createWriteStream().end(highlighted[key]);
	});

	let count = 0;
	tr.selectAll('[data-url]', listItem => {
		const itemUrl = data.urls[count++];
		listItem.setAttribute('value', itemUrl);
	});
}
