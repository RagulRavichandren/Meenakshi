/**
 * Sri Meenakshi Sweets & Bakery (SINCE 1977, Madurai)
 * Web Server - Zero Dependency Built-in Node.js HTTP Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  if (reqPath === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: "Sri Meenakshi Sweets & Bakery",
      since: 1977,
      phone: "+91 9489872822",
      whatsapp: "+91 9489872822",
      hours: "7:00 AM - 10:30 PM (All 7 Days)",
      branches: [
        {
          name: "Sri Meenakshi Sweets (Fatima College Branch)",
          address: "Fatima College, Madurai",
          landmark: "Opposite to Fatima College"
        },
        {
          name: "Sri Meenakshi Sweets (Vilangudi Branch)",
          address: "Vilangudi, Madurai",
          landmark: "Opposite to Bus Stop"
        },
        {
          name: "Sri Meenakshi Bakery & Production Kitchen",
          address: "Pallavan Nagar, Kalavasal, Madurai",
          landmark: "Kalavasal Junction"
        }
      ],
      specialties: [
        "Puffs & Savory Pastries",
        "Traditional & Ghee Sweets",
        "Cakes & Confectionery",
        "Karams & Savories",
        "Traditional Buns",
        "Daily Artisan Breads"
      ]
    }));
    return;
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Sri Meenakshi Sweets & Bakery - Web Platform`);
  console.log(` SINCE 1977 | Madurai, Tamil Nadu`);
  console.log(` Server running at: http://localhost:${PORT}`);
  console.log(` Serving directory: ${PUBLIC_DIR}`);
  console.log(`=======================================================`);
});
