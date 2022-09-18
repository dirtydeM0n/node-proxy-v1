const http = require("http");
const https = require("https");
const fs = require(`fs`);

// for http
function onRequest(req, res) {
  console.log("serve: " + req.url);

  if (!req.headers.host) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.write("Invalid header");
    res.end();
  }

  const options = {
    hostname: req.headers.host.split(":")[0],
    port: req.headers.host.split(":")[1] ?? 3000,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
    },
    timeout: 180000,
  };

  const proxy = http.request(options, function (r) {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res, {
      end: true,
    });
  });

  req.pipe(proxy, {
    end: true,
  });
}

http.createServer(onRequest).listen(80);
https
  .createServer(
    {
      key: fs.readFileSync("src/key.pem"),
      cert: fs.readFileSync("src/cert.pem"),
    },
    onRequest
  )
  .listen(443);
