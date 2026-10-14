const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const routes={'/':'demo/index.html','/index.html':'demo/index.html','/demo/index.html':'demo/index.html','/demo/style.css':'demo/style.css','/demo/app.js':'demo/app.js','/src/engine.js':'src/engine.js'};
http.createServer((req,res)=>{
  const file=routes[new URL(req.url,'http://localhost').pathname];
  if(!file){res.writeHead(404);return res.end('Not found');}
  res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript');
  res.setHeader('X-Content-Type-Options','nosniff');
  fs.createReadStream(path.join(base,file)).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('GTM Lab demo: http://127.0.0.1:4173'));
