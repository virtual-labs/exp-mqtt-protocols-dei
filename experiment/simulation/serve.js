import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const DIST_DIR = join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle favicon requests
  if (req.url === '/favicon.ico') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // Default to index.html for root or non-file paths
  let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // If the path doesn't have an extension, serve index.html (for SPA routing)
  if (!extname(filePath)) {
    filePath = join(DIST_DIR, 'index.html');
  }
  
  try {
    const contentType = MIME_TYPES[extname(filePath)] || 'application/octet-stream';
    const content = readFileSync(filePath);
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, serve index.html for SPA routing
      try {
        const content = readFileSync(join(DIST_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      } catch (e) {
        res.writeHead(404);
        res.end('File not found');
      }
    } else {
      res.writeHead(500);
      res.end(`Server Error: ${error.code}`);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});