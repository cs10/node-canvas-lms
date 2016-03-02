/** canvas.js
 *      Desc. TODO
 *
 *  Author: Michael Ball
 */
'use strict';

var url     = require('url');
var format  = require('util').format;

var request = require('request');
var fuzzy   = require('fuzzy');

function Canvas(host, options) {
    var token;
    options = options || {};

    // Handle Default arguments.
    if (typeof host === 'object') {
        options = host;
        host = options.host;
    }
    token = options.token;

    if (!host) {
        throw new CanvasError('A Canvas instance requires a host',
            `Expected a URL but found ${host}.`);
    }

    this.name = 'canvas' || options.name;
    this.accessToken = options.token || '';
    this.apiVersion = this.normalizeVersion(options.version) || 'v1';
    this.host = host;
    this.options = options;
}

/*
    Make sure the version matches the 'vN' format.
*/
Canvas.prototype.normalizeVersion = function (version) {
    return version;
}

Canvas.prototype.resloveURL = function (endpoint) {
    var slash = endpoint.startsWith('/') ? '' : '/';
    return `${this.host}/api/${this.apiVersion + slash + endpoint}`;
};

Canvas.prototype._http = function (method, args) {
    var options = {
        method: method,
        url: this.resloveURL(args.endpoint),
        qs: args.query,
        headers: {
            Authorization: 'Bearer ' + this.accessToken
        },
        json: true,
        useQuerystring: true
    }

    //TODO: Can this be null on get requests?
    if (args.form) {
        options.form = args.form;
    }
    return request(options, args.cb);
};


// Primitive HTTP methods.
// These are just wrappers around _http with the proper method applied.
Canvas.prototype.get = function (endpoint, query, cb) {
    return this._http('GET', defaultArguments(endpoint, query, cb));
};

Canvas.prototype.post = function (endpoint, query, form, cb) {
    return this._http('POST', defaultArguments(endpoint, query, form, cb));
};

Canvas.prototype.put = function (endpoint, query, form, cb) {
    return this._http('PUT', defaultArguments(endpoint, query, form, cb));
};

Canvas.prototype.delete = function (endpoint, query, cb) {
    return this._http('DELETE', defaultArguments(endpoint, query, cb));
};

// TODO: Fix this.
Canvas.prototype.getFuzzy = function (searchStr, endpoint, query, cb) {
    function fuzzySearcher(err, resp, body) {
        var matches;
        if (err || resp.statusCode >= 300 || !body || body.errors) {
            throw new CanvasError('Uh oh! Fuzzy Searching Borked.');
        }
        
        return fuzzy
                .filter(searchStr, body, extractor)
                // fuzzy returns complex objects, we just want 'x.original'
                .map(function (x) { return x.original });
    }
    return this.allPages(ndpoint, query, fuzzySearcher);
}

// Canvas LMS Specific Methods
Canvas.prototype.allPages = function (endpoint, query, cb, prevData) {
    // TODO: verify that paginated content will always be arrayed.
    var prevData = prevData || [],
        myself = this;
    this.get(endpoint, query, function(error, resp, body) {
        var query = {}, linkHeaders;
        if (error || body.errors) {
            // TODO: body + prev data?
            cb(error, resp, body);
        }
        linkHeaders = parseLinkHeaders(resp.headers.link);
        if (linkHeaders.next) {
            // Note: this is throwing an error in some cases...
            query = url.parse(linkHeaders.next).query;
            myself.allPages(endpoint, query, cb, body + prevData);
        } else {
            // TODO: verify this concatentation works...
            cb(error, resp, body + prevData);
        }
    });
};

// Error Handling
function CanvasError() {
    var msg = format.apply(null, arguments);
    msg.name = 'Canvas Error'
    return this.uber(msg);
}

CanvasError.prototype = Object.create(Error.prototype);
CanvasError.uber = Error;

// Utility Functions -- not exported
function defaultArguments(endpoint, query, form, cb) {
    // normalize based on whether form exists.
    // in GET/DELETE "form" will be a callback if query is provided.
    if (cb === undefined) {
        cb = form;
        form = null;
    }

    if (typeof query === 'function') {
        cb = query;
        query = {};
    }

    if (cb.length !== 3 && cb.length !== 0) {
        throw new CanvasError(cb.name + ': callback function should have 3' +
                    ' parameters, but had ' + cb.length + '.');
    }

    return {
        endpoint: endpoint,
        query: query,
        form: form,
        cb: cb
    };
}

/** parseLinkHeaders - get an object from a canvas header string
 *  Canvas returns link headers as a fat, annoying string:
 *  <url>; rel="type",<url>; rel="type"...
 *  See: https://bcourses.berkeley.edu/doc/api/file.pagination.html
 *  @param {string} the link field from a request header
 *  @return {object} a mapping of rel-value: url

    // TODO: Use these to build an object
    // could make it easier to check if a paramter exists?
    allowedRel = [
        'current',
        'next',
        'prev',
        'first',
        'last'
    ];
 */
function parseLinkHeaders(linkStr) {
    var formatRE, match, output = {};
    formatRE = /<(.*?)>;\s+rel="(\w+)",?/gi;

    match = formatRE.exec(linkStr);
    while (match !== null) {
        if (match.length > 2) {
            output[match[2]] = match[1];
        }
        match = formatRE.exec(linkStr);
    }
    return output;
}

module.exports = Canvas;
