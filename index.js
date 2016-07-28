// core Node.js modules
const http = require('http'); // http client
const fs = require('fs'); // file system
const crypto = require('crypto'); // crypto

// useful npm modules that do one thing and one thing well (unix philosophy)
const routes = require('patterns')(); // http router
const st = require('st'); // static file server
const body = require('body/json'); // form body parser
const oppressor = require('oppressor'); // gzip
const Twitter = require('node-twitter-api');
const url = require('url');
const trumpet = require('trumpet');
const has = require('has');
const cookie = require('cookie');

const users = {};
const sessions = {};

const twitter = Twitter({
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  callback: 'http://127.0.0.1:9090/twitter/auth/success'
});

// server gzipped static files from the dist folder
const serve = st({
  path: 'browser/dist/',
  cache: false // edit or delete this line for production
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
	header.setAttribute('class', 'header__nav--logged-in');

    const btn = tr.select('.header__nav-btn');
    btn.setAttribute('class', 'header__nav-item--hide');

	const avatarItem = tr.select('.header__nav-avatar');
	avatarItem.setAttribute('class', 'header__nav-item');

	const avatar = tr.select('.avatar');
	avatar.setAttribute('href', `/@${data.screen_name}`);

	const avatarImg = tr.select('.avatar__img');
	avatarImg.setAttribute('href', `/@${data.screen_name}`);
	avatarImg.setAttribute('src', data.profile_image_url_https);

    page.pipe(tr).pipe(oppressor(req)).pipe(res);

  } else {
    render('index')(req, res)
  }
});

routes.add(/^GET \/@/, (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const isSession = cookies.session && has(sessions, cookies.session);
  if (isSession) {
    const data = sessions[cookies.session].data;
 
    if (data.screen_name !== req.url.split('@')[1]) {
      res.writeHead(302, {
        'Location': `/@${data.screen_name}`
      });

      res.end();
    } else {

      const tr = trumpet();
      const page = fs.createReadStream('browser/account.html');

      const avatar = tr.select('.account__avatar');
      avatar.setAttribute('src', data.profile_image_url_https
        .replace('_normal', ''));

      const username = tr.select('.account__username');
      username.createWriteStream().end(data.screen_name);

      const bio = tr.select('.account__bio');
      bio.createWriteStream().end(data.description);

      const header = tr.select('.account__header');
      header.setAttribute('style', `background-image: url('${data.profile_banner_url}');`);

      page.pipe(tr).pipe(oppressor(req)).pipe(res);

    }

  } else {
    res.writeHead(302, {
      'Location': '/twitter/auth'
    });

    res.end();
  }
});

routes.add('GET /twitter/auth', (req, res) => {
  twitter.getRequestToken((err, token, tokenSecret, results) => {
    if (err) {
      console.error(err);
      error(res, err)
    } else {
      users[token] = {};
      users[token].secret = tokenSecret;

      res.writeHead(302, {
        'Location': twitter.getAuthUrl(token)
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
    twitter.getAccessToken(token, users[token].secret, verifier,
      getAccessToken(req, res, token));
  } else {
    res.writeHead(302, {
      'Location': '/'
    });

    res.end();
  }
});

routes.add('POST /register', (req, res, params) => {
  body(req, res, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(err + '\n');
    } else {
      
      const now = new Date().toISOString();
      const id = crypto.randomBytes(6).toString('hex');
      const key = now + id;
      
      const payload = Object.assign({}, data, {
        osapi: key
      });

      const html = fs.createReadStream('browser/components/keygen.html');
      const tr = trumpet();
      
      const keySelector = tr.select('.openshare-key');
      keySelector.createWriteStream().end(key);
     
      const count = 0;
      tr.selectAll('url-list__input', listItem => {
        const url = data.urls[count++]
        
        listItem.setAttribute('value', url); 
      });
      
      html.pipe(tr).pipe(oppressor(req)).pipe(res);
    }
  });
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
  }
  else serve(req, res);

});

// listen for http request on port 9090
server.listen(9090, () => {
  console.log('Server is running on http://127.0.0.1:9090');
});


function render (page) {
  return (req, res) => {
    res.setHeader('content-type', 'text/html');

    fs.createReadStream(`browser/${page}.html`)
      .pipe(oppressor(req))
      .pipe(res);
  };
}

function getAccessToken (req, res, user) {
  return function (err, token, secret, results) {
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

function verifyCreds (req, res) {
  return function (err, data, response) {
    if (err) {
      console.error(err);
      err(res, err)
    } else {
      const sid = crypto.randomBytes(64).toString('hex');
      sessions[sid] = {}
      sessions[sid].data = data

      res.setHeader('set-cookie', `session=${sid};Path=/;`);

      res.writeHead(302, {
        'Location': `/@${data.screen_name}`
      });

      res.end();
    }
  };
}

function error (res, err) {
  res.statusCode = err.statusCode;
  res.end(err.data + '\n')
}
