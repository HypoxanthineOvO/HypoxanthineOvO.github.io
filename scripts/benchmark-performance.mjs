// Cold-cache, fixed-window comparison. node scripts/benchmark-performance.mjs dist /tmp/result.json
// Local origin isolates asset changes from external hosting/CDN conditions.
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
const root = resolve(process.argv[2] || 'dist');
const output = resolve(process.argv[3] || '/tmp/myweb-performance.json');
const runs = Number(process.env.PERF_RUNS || 3);
const windowMs = Number(process.env.PERF_WINDOW_MS || 30000);
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.avif':'image/avif', '.mp4':'video/mp4' };
const cache = new Map();
const server = createServer(async (req, res) => {
  try {
    let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + sep) && file !== root) throw new Error('outside');
    if ((await stat(file)).isDirectory()) file += '/index.html';
    let item = cache.get(file);
    if (!item) {
      const mime = types[extname(file)] || 'application/octet-stream';
      const raw = await readFile(file);
      const gzip = /^(text\/|application\/json|image\/svg)/.test(mime);
      item = { body: gzip ? gzipSync(raw) : raw, mime, gzip };
      cache.set(file, item);
    }
    res.writeHead(200, { 'Content-Type':item.mime, 'Content-Length':item.body.length, 'Cache-Control':'no-store', ...(item.gzip ? {'Content-Encoding':'gzip'} : {}) });
    res.end(item.body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath:process.env.PW_CHROME } : {});
const measurements = [];
const group = (type, url) => type === 'Font' || /\.woff2?(?:\?|$)/.test(url) ? 'font' : type === 'Image' ? 'image' : type === 'Media' ? 'media' : type === 'Stylesheet' ? 'css' : type === 'Script' ? 'js' : type === 'Document' ? 'html' : 'other';
try {
  for (const device of ['desktop','mobile']) {
    for (let run = 1; run <= runs; run++) {
      const context = await browser.newContext({ viewport:device === 'desktop' ? {width:1440,height:1000} : {width:390,height:844}, deviceScaleFactor:1, isMobile:device === 'mobile' });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', {cacheDisabled:true});
      await cdp.send('Network.emulateNetworkConditions', {offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular4g'});
      await cdp.send('Emulation.setCPUThrottlingRate', {rate:4});
      await page.addInitScript(() => {
        window.__perf = {lcp:null};
        new PerformanceObserver(list => { for (const e of list.getEntries()) window.__perf.lcp = {time:e.startTime,url:e.url || null,tag:e.element?.tagName || null}; }).observe({type:'largest-contentful-paint',buffered:true});
      });
      const requests = new Map();
      cdp.on('Network.requestWillBeSent', e => requests.set(e.requestId, {url:e.request.url,type:e.type,receivedBytes:0,complete:false}));
      cdp.on('Network.responseReceived', e => { const r=requests.get(e.requestId); if(r) Object.assign(r, {type:e.type,status:e.response.status}); });
      cdp.on('Network.dataReceived', e => { const r=requests.get(e.requestId); if(r) r.receivedBytes += e.encodedDataLength; });
      cdp.on('Network.loadingFinished', e => { const r=requests.get(e.requestId); if(r) Object.assign(r,{complete:true,receivedBytes:e.encodedDataLength}); });
      cdp.on('Network.loadingFailed', e => { const r=requests.get(e.requestId); if(r) r.failure=e.errorText; });
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const start=Date.now();
      await page.goto(url, {waitUntil:'commit',timeout:windowMs});
      await page.waitForTimeout(Math.max(0,windowMs-(Date.now()-start)));
      const timing=await page.evaluate(() => ({ fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,lcp:window.__perf.lcp,domContentLoaded:performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,load:performance.getEntriesByType('navigation')[0]?.loadEventEnd,fontsStatus:document.fonts.status }));
      const assets=[...requests.values()];
      const categories={};
      for(const r of assets) { const k=group(r.type,r.url); const c=categories[k] ||= {requests:0,completed:0,receivedBytes:0,completedBytes:0}; c.requests++; c.completed+=Number(r.complete); c.receivedBytes+=r.receivedBytes; if(r.complete)c.completedBytes+=r.receivedBytes; }
      const item={device,run,windowMs,timing,categories,receivedBytes:assets.reduce((n,r)=>n+r.receivedBytes,0),unfinished:assets.filter(r=>!r.complete&&!r.failure).length,errors,requests:assets};
      measurements.push(item);
      console.log(JSON.stringify({device,run,fcp:timing.fcp,lcp:timing.lcp,receivedBytes:item.receivedBytes,unfinished:item.unfinished}));
      await context.close();
    }
    // Separate unthrottled static screenshot: no impact on timing samples.
    const context=await browser.newContext({viewport:device==='desktop'?{width:1440,height:1000}:{width:390,height:844},reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.goto(url,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:output.replace(/\.json$/,`-${device}.png`)});
    await context.close();
  }
  const median = a => [...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
  const summary=Object.fromEntries(['desktop','mobile'].map(device=>{
    const m=measurements.filter(x=>x.device===device);
    return [device,{fcpMs:median(m.map(x=>x.timing.fcp)),lcpMs:median(m.map(x=>x.timing.lcp?.time)),receivedBytes:median(m.map(x=>x.receivedBytes)),unfinished:median(m.map(x=>x.unfinished)),categories:Object.fromEntries([...new Set(m.flatMap(x=>Object.keys(x.categories)))].map(k=>[k,Object.fromEntries(['requests','completed','receivedBytes','completedBytes'].map(f=>[f,median(m.map(x=>x.categories[k]?.[f]||0))]))]))}];
  }));
  await writeFile(output,JSON.stringify({root,conditions:{downloadBitsPerSecond:1600000,latencyMs:150,cpuSlowdown:4,windowMs,runs,cache:'disabled',compression:'gzip for text; native image/font encoding',note:'Local origin; no DNS/TLS/CDN delay. Bytes include partial requests; LCP observed only within fixed window.'},summary,measurements},null,2));
  console.log(JSON.stringify(summary,null,2));
} finally {await browser.close();server.close();server.closeAllConnections();}
