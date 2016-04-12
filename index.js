/**
 * @author Barret Lee<http://barretlee.com/about/>
 * @description A mini file system web server.
 *
 * @example
 *   // command line mode
 *   babel-node index.js ../
 * @example 2
 *   import {start} from './index';
 *   start({
 *     base: '..',
 *     favicon: 'http://barretlee.com/favicon.ico'
 *   })
 */
import http from 'http';
import fs from 'fs';
import path from 'path';

let setting = {
  port: process.env.PORT || 8800,
  favicon: 'http://barretlee.com/favicon.ico',
  base: __dirname
};

/**
 * Entry file, start a http server
 */
const start = (options) => {
  options = options || {};
  if(options.base && !path.isAbsolute(options.base)) {
    options.base = path.join(__dirname, options.base);
  }
  for(let i in options) {
    setting[i] = options[i];
  }
  // setting = Object.assign(setting, options || {});
  http.createServer((req, res) => {
    const url = req.url;
    let p = setting.base;
    switch(url) {
      case '/':
        break;
      case '/favicon.ico':
        return fetchFavicon(res);
      default:
        p = path.join(setting.base, url.slice(1));
    }
    console.log('Visit: ' + p);
    if(!fs.existsSync(p)) {
      return res.end('Path err.');
    }
    if(fs.statSync(p).isDirectory()) {
      const dirInfo = listDir(p);
      const html = makeHtml(dirInfo);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf8'
      });
      res.write(html);
    } else {
      res.write(fs.readFileSync(p));
    }
    res.end();
  }).listen(setting.port, () => {
    console.log('Listen at: http://localhost:' + setting.port);
  });
};

/**
 * Get dir list
 */
const listDir = (root) => {
  return fs.readdirSync(root).map((item) => {
    let p = path.join(root, item);
    if(fs.statSync(p).isDirectory()) {
      return {
        name: p.replace(setting.base + '/', ''),
        type: 'dir'
      }
    } else {
      return  {
        name: p.replace(setting.base + '/', ''),
        type: 'file'
      }
    }
  });
};

/**
 * Fetch favicon
 */
const fetchFavicon =  (stream) => {
  http.get(setting.favicon, (res) => {
    res.pipe(stream);
  }).on('error', (e) => {
    console.log('Fetch favicon error.');
  });
};

/**
 * Make Html from dir list object
 */
const makeHtml =  (data) => {
  let str = '<ul>';
  data.forEach((val) => {
    let type = '/';
    if(val.type !== 'dir') {
      type = '';
    }
    str += `<li><a href='http://localhost:${setting.port}/${val.name}'>${val.name}</a></li>`;
  });
  return str + '</ul>';
}

const argPath = process.argv[2];
if(argPath) {
  if(/^\//.test(argPath)) {
    console.log('Please use relative path. such as:\n\n    babel-node index ../\n');
  } else {
    start({
      base: argPath
    });
  }
} else {
  start();
}


module.exports = start;