const https = require("https");
const http = require("http");
const fs = require("fs");

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

function onRequestHTTPS(req, res) {
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

  const proxy = https.request(options, function (r) {
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

// Create an HTTPS service identical to the HTTP service.
https.createServer(onRequestHTTPS).listen(443);
console.log("Listening on port 3003");
