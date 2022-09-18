const http = require("http");

function onRequest(req, res) {
  console.log("serve: " + req.url);

  if (!req.headers.authorization) {
    return res.status(403);
  }

  const options = {
    hostname: req.headers.authorization.split(":")[0],
    port: req.headers.authorization.split(":")[1] ?? 3000,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
    },
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

http.createServer(onRequest).listen(3003);
console.log("Listening on port 3003");
