'use strict';

var request = require('request');
var resolve = require('url').resolve;
var format  = require('util').format;

function Canvas(host, options) {
    if (!host || typeof host != 'string') {
        throw new CanvasError('A Canvas instance requires a host');
    }

    if (host.indexOf('https') != 0) {
        throw new CanvasError(
            'Hosts must be https://'
        )
    }

    options = options || {};
    this.name = 'canvas' || options.name;
    this.accessToken = options.accessToken || options.token || '';
    this.apiVersion = options.apiVersion || options.version || 'v1';
    this.host = host;
}


Canvas.prototype._buildApiUrl = function (endpoint) {
    if (endpoint.substring[0] != '/') {
        endpoint = '/' + endpoint;
    }
    return resolve(this.host,  '/api/' + this.apiVersion + endpoint);
};

Canvas.prototype._http = function (method, args) {
    var options = {
        method: method,
        url: this._buildApiUrl(args.endpoint),
        qs: args.query,
        // Defaults:
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
    return request(options, cb);
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

// Error Handling
function CanvasError(args) {
    var msg = format.apply(null, this.arguments);
    msg.name = 'Canvas Error'
    return this.uber(msg);
}

CanvasError.prototype = Object.create(Error.prototype);
CanvasError.uber = Error;

// Utility Functions -- not exported
function defaultArguments(endpoint, query, form, cb) {
    // normalize based on whether form exists.
    // in GET/DELETE "form" will be a callback if query is provided.
    if (arguments.length == 3) {
        cb = form;
        form = null;
    }

    if (typeof query == 'function') {
        cb = query;
        query = {};
    }

    if (cb.length != 3) {
        throw new CanvasError(func.name + ': callback function should have 3' +
                    ' parameters, but had ' + cb.length + '.');
    }

    return {
        endpoint: endpoint,
        query: query,
        form: form,
        cb: cb
    };
}

module.exports = Canvas;
