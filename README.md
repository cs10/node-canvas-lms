canvas-lms-api
==============

A very simple node.js wrapper for the Canvas LMS API

## Usage
```js
var Canvas = require('node-canvas-lms');

var class = new Canvas('YOUR-HOST',
    { token: 'YOUR-TOKEN',
      version: 'optional defaults to v1'
    });
```

