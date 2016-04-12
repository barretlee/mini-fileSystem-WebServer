## Kelvin - A mini file system web server

A mini file system web server, you can call him Kelvin.

- `/index.js`, require `babel-core`
- `/lib/build.js`, transfer from `babel-core`, compatiable with `node: ~v0.12.x`

## Install & Develop

Install from npm,

```bash
npm install mini-fileSystem-WebServer;
node node_modules/mini-fileSystem-WebServer/lib/index.js;

# or run with babel-node
babel-node node_modules/mini-fileSystem-WebServer/index.js;
```

Install from github:

```bash
git clone https://github.com/barretlee/mini-fileSystem-WebServer.git;
cd mini-fileSystem-WebServer;
npm run node;

# or run with babel-node
npm run babel;
```

## Usage

**Command Line Mode**

with babel-node,

```bash
$ babel-node index RELATIVE_PATH_OR_IGNORE
```

Of course, you can also use the ES5 compatiable mode via `lib/build` in this way whitout babel installed:

```bash
$ node index RELATIVE_PATH_OR_IGNORE
```

**Use in File**

```javascript
import {start} from './index';
start({
  port: 3300,
  base: '..',
  favicon: 'http://barretlee.com/favicon.ico'
});
```

or, es5 compatiable mode:

```javascript
var start = require('./lib/build');
start({
  port: 3300,
  base: '..',
  favicon: 'http://barretlee.com/favicon.ico'
});
```


There are two params:

- `base`, the relative path, not required.
- `favicon`, you knewn it, default is my avatar, not required.

and logs printed:

```bash
$ babel-node index ..
Listen at: http://localhost:8800
Visit: /Users/barret/work/test
Visit: /Users/barret/work/test/bug.js
Visit: /Users/barret/work/test/co
Visit: /Users/barret/work/test/co/test
Visit: /Users/barret/work/test/co/del
Visit: /Users/barret/work/test/co/del/b
```

## Develop

```bash
cd mini-fileSystem-WebServer;
npm install;
npm run babel;
```

edit `index.js` and build to `lib/index.js`:

```bash
npm run build;
```


## LICENSE

MIT License.