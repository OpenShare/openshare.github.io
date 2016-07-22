// core Node.js modules
const http = require('http'); // http client
const fs = require('fs'); // file system
const crypto = require('crypto'); // crypto

// useful npm modules that do one thing and one thing well (unix philosophy)
const routes = require('patterns')(); // http router
const st = require('st'); // static file server
const body = require('body/any'); // form body parser
const oppressor = require('oppressor'); // gzip

// server gzipped static files from the dist folder
const serve = st({
  path: 'browser/dist/',
  cache: false // edit or delete this line for production
});

// routing
routes.add('GET /', render('index'));
routes.add('GET /account', render('account'));
routes.add('POST /login', (req, res, params) => {
  body(req, res, (err, form) => {
    if (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(err + '\n');
    }

    res.end();

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
