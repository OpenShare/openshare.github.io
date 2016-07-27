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
const url = require('url')

const users = {}

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
routes.add('GET /', render('index'));
routes.add('GET /account', render('account'));

routes.add('GET /twitter/auth', (req, res) => {
  twitter.getRequestToken((err, token, tokenSecret, results) => {
    if (err) {
      console.error(err)
    } else {
      users[token] = {}
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
  const token = params['oauth_token']
  const verifier = params['oauth_verifier']
  
  twitter.getAccessToken(token, users[token].secret, verifier,
    getAccessToken(req, res, token));
})

routes.add('POST /register', (req, res, params) => {
  body(req, res, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(err + '\n');
    }
    
  })
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
  console.log('Server is running on http://localhost:9090');
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
    } else {
      users[user].access = token;
      users[user].accessSecret = secret;
      
      twitter.verifyCredentials(token, secret, verifyCreds(req, res))
    }
  }
}

function verifyCreds (req, res) {
  return function (err, data, response) {
   if (err) {
     console.error(err)
   } else {
     res.end(data['screen_name']);  
   }
  }
}
