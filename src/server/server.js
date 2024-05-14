const express = require('express');
const prometheus = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

const httpRequestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'The total number of HTTP requests',
  labelNames: ['method', 'status'],
});

app.use((req, res, next) => {
  httpRequestCounter.inc({ method: req.method, status: res.statusCode });
  next();
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
