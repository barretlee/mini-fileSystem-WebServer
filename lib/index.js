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
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var setting = {
  port: process.env.PORT || 8800,
  favicon: 'http://barretlee.com/favicon.ico',
  base: __dirname
};

/**
 * Entry file, start a http server
 */
var start = function start(options) {
  options = options || {};
  if (options.base && !_path2['default'].isAbsolute(options.base)) {
    options.base = _path2['default'].join(__dirname, options.base);
  }
  for (var i in options) {
    setting[i] = options[i];
  }
  // setting = Object.assign(setting, options || {});
  _http2['default'].createServer(function (req, res) {
    var url = req.url;
    var p = setting.base;
    switch (url) {
      case '/':
        break;
      case '/favicon.ico':
        return fetchFavicon(res);
      default:
        p = _path2['default'].join(setting.base, url.slice(1));
    }
    console.log('Visit: ' + p);
    if (!_fs2['default'].existsSync(p)) {
      return res.end('Path err.');
    }
    if (_fs2['default'].statSync(p).isDirectory()) {
      var dirInfo = listDir(p);
      var html = makeHtml(dirInfo);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf8'
      });
      res.write(html);
    } else {
      res.write(_fs2['default'].readFileSync(p));
    }
    res.end();
  }).listen(setting.port, function () {
    console.log('Listen at: http://localhost:' + setting.port);
  });
};

/**
 * Get dir list
 */
var listDir = function listDir(root) {
  return _fs2['default'].readdirSync(root).map(function (item) {
    var p = _path2['default'].join(root, item);
    if (_fs2['default'].statSync(p).isDirectory()) {
      return {
        name: p.replace(setting.base + '/', ''),
        type: 'dir'
      };
    } else {
      return {
        name: p.replace(setting.base + '/', ''),
        type: 'file'
      };
    }
  });
};

/**
 * Fetch favicon
 */
var fetchFavicon = function fetchFavicon(stream) {
  _http2['default'].get(setting.favicon, function (res) {
    res.pipe(stream);
  }).on('error', function (e) {
    console.log('Fetch favicon error.');
  });
};

/**
 * Make Html from dir list object
 */
var makeHtml = function makeHtml(data) {
  var str = '<ul>';
  data.forEach(function (val) {
    var type = '/';
    if (val.type !== 'dir') {
      type = '';
    }
    str += '<li><a href=\'http://localhost:' + setting.port + '/' + val.name + '\'>' + val.name + '</a></li>';
  });
  return str + '</ul>';
};

var argPath = process.argv[2];
if (argPath) {
  if (/^\//.test(argPath)) {
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
