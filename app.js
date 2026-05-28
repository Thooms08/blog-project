const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Memastikan aplikasi berjalan dalam mode production
const dev = false;
// dir: path.resolve(__dirname) memastikan Next.js mencari folder .next di tempat app.js berada
const app = next({ dev, dir: path.resolve(__dirname) });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Next.js secara otomatis menangani Route Group seperti (public) 
    // selama folder .next hasil build sudah benar.
    handle(req, res, parsedUrl);
    
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log('> Server ready on port ' + (process.env.PORT || 3000));
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});