# node-canvas-lms


A very simple node.js wrapper for the Canvas LMS API

## Usage
```js
var Canvas = require('node-canvas-lms');

var class = new Canvas('YOUR-HOST',
    { token: 'YOUR-TOKEN',
      version: 'optional defaults to v1'
    });
```

## Development

The master branch tracks the stable version, which is published to npm. Development occurs on the [dev branch][dev]. Currently This is going through a pretty big update, so be sure to check that out.

[dev]: https://github.com/cs10/node-canvas-lms/tree/dev

