const http = require('http');

const port = Number(process.env.PORT) || 3001;
const timeoutMs = 4000;

const backend_url = process.env.API_BASE_URL || `http://127.0.0.1:${port}`

const req = http.get(`${backend_url}/health`, (res) => {
  res.resume();
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
req.setTimeout(timeoutMs, () => {
  req.destroy();
  process.exit(1);
});
