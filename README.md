# canvas-lms

A simple node.js wrapper for the [Canvas LMS][canvas] [API][api-docs], with some sugar!

[canvas]: http://github.com/instructure/canvas-lms/
[api-docs]: https://canvas.instructure.com/doc/api/

## Quick Overview

The only required parameter is `host`, but in most cases, you'll also want an auth token to do anything useful.

```js
var Canvas = require('node-canvas-lms');

var lms = new Canvas({
	host: 'https://canvas.instructure.com',
	token: 'YOUR-TOKEN',
	name: ' (Optional) My Awesome Canvas Site'
});

// OR
var lms = new Canvas('https://canvas.instructure.com', 'YOUR-TOKEN', options);
```

The `Cavnas` object is a very simple API wrapper based around [requests][requests], designed to allow easier access. There's two basics:

* Options: Pass an `options` object when creating a Canvas instance. There are currently a few parameters, but only `token` is required.
	* `token`: an auth token to access your Canvas instance. [See these docs.][canvas-token]
	* `version`: This defaults to `"v1"`, which is currently the only version of the Canvas LMS API. However, if versions change, the support is there.
	* `name`: is an optional name for the Canvas instance. It's useful for debugging if you have lots of different instances.
	* TODO: - headers, ID formats

[requests]: http://todo
[canvas-docs]: http://todo

## Functions
A `Canvas` object has 4 main functions: `get`, `post`, `put`, `delete`.

* `.get(endpoint, query, callback)`
* `.post(endpoint, query, form, callback)`
* `.put(endpoint, query, form, callback)`
* `.delete(endpoint, query, callback)`

* `endpoint` is a string, which is the URL you are calling. It should start from the part after "v1/" in the Canvas URL.
	* Example:
		* The full URL: `https://bcourses.berkeley.edu/api/v1/courses/1371647/users`
		* Should be written as: `courses/1371647/users`
* `query` is a native object which gets encoded as a querystring by node.
	* Example:
		* The object:

		```js
		{
			per_page: 100,
			include: ['assignments', 'user']
		}
		```
		* Will return: `?per_page=100&include[]=assignments&include[]=user`
	* This have been designed to follow Canvas conventions for querystring formats (which are based on Rails). I highly recommend using this object format rather than writing your own strings!
* `callback`: Is a [request callback][request-cb]. It has the format:

	```js
	function (err, response, body) {

	}
	```
	* Note that `body` will be parsed and return a native JS object, rather than a JSON string.
* `form`: For `put` and `post` requests, a `form` parameter is usually expected. This us a URL-form-encoded parameter. TODO: reference canvas docs...

[request-cb]: http://
#### Shorthand
All functions support a shorthand format, where `query` and `form` are empty. In that case the method signatures look like this:

* `.get(endpoint, callback)`
* `.post(endpoint, callback)`
* `.put(endpoint, callback)`
* `.delete(endpoint, callback)`

## Course Objects

## FUTURE

### Requirements
`canvas-lms` makes use of ES6, so please use Node.js 4.2.x or newer. To use an older version of node, please use the `v0.0.7` tag. 4.2 has LTS so, this hopefully isn't a terrible restriction!