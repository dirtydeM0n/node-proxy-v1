const http = require("http");
const https = require("https");
const fs = require(`fs`);

// for http
function onRequest(req, res) {
  console.log("serve: " + req.url);

  if (!req.headers.host) {
    // 400 bad request as per the assignment's directive
    res.writeHead(400, { "Content-Type": "text/html" });
    res.write("Invalid header");
    res.end();
  }

  // didn't feel like using a dns to resolve the arbitrary endpoint so I custom made this "mega jugaar" in order to use my service's own port
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
// listening to public ports
// openssl certificates were manually generated
http.createServer(onRequest).listen(80);

// instantiating https
https
  .createServer(
    {
      key: fs.readFileSync("src/key.pem"),
      cert: fs.readFileSync("src/cert.pem"),
    },
    onRequest
  )
  .listen(443);

console.log("Proxy server by AHS. Up and running on port 80 and 443");
