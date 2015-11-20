'use strict';

var request = require('request');
var resolve = require('url').resolve;
var format  = require('util').format;

function CanvasError(args) {
    var msg = format.apply(null, this.arguments);
    return this.uber(msg);
}

CanvasError.prototype = Object.create(Error.prototype);
CanvasError.uber = Error;

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

function isHttpClientError(response) {
    return (response.statusCode >= 400 && response.statusCode < 500);
}

function isHttpError(response) {
    return (isHttpClientError(response) || isHttpServerError(response));
}

function isHttpServerError(response) {
    return (response.statusCode >= 500 && response.statusCode < 600);
}

Canvas.prototype._buildApiUrl = function (endpoint) {
    if (endpoint.substring[0] != '/') {
        endpoint = '/' + endpoint;
    }
    return resolve(this.host,  '/api/' + this.apiVersion + endpoint);
};

Canvas.prototype._http = function (options, cb) {
    options.headers = {
        Authorization: 'Bearer ' + this.accessToken
    };
    options.json = true;
    options.useQuerystring = true;

    return request(options, cb);
};

Canvas.prototype.get = function (endpoint, query, cb) {
    var options, args;
    args = defaultArguments(endpoint, query, cb);
    options = {
        method: 'GET',
        url: this._buildApiUrl(args.endpoint),
        qs: args.query
    };
    return this._http(options, args.cb);
};

Canvas.prototype.post = function (endpoint, query, form, cb) {
    var options, args;
    args = defaultArguments(endpoint, query, form, cb);
    options = {
        method: 'POST',
        url: this._buildApiUrl(args.endpoint),
        qs: args.query,
        form: args.form
    };
    return this._http(options, args.cb);
};

Canvas.prototype.put = function (endpoint, query, form, cb) {
    var args, options;
    args = defaultArguments(endpoint, query, form, cb);
    options = {
        method: 'PUT',
        url: this._buildApiUrl(args.endpoint),
        qs: args.query,
        form: args.form,
    };
    return this._http(options, args.cb);
};

Canvas.prototype.delete = function (endpoint, query, cb) {
    var options, args;
    args = defaultArguments(endpoint, query, cb);
    options = {
        method: 'DELETE',
        url: this._buildApiUrl(args.endpoint),
        qs: args.query
    };

    return this._http(options, args.cb);
};

function defaultArguments(endpoint, query, form, cb) {
    // normalize based on whether form exists.
    // in GET/DELETE "form" will be a callback if query is provided.
    if (arguments.length == 3) {
        cb = form;
        form = null;
    }

    if (typeof query == 'Function') {
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

// TODO: don't use this function
Canvas.prototype.getID = function (idType, id, callback) {
    var endpoint = 'users/' + (idType ? idType + ':' : '') + id + '/profile';
    return this.get(endpoint, '', function (body) {
        if (body.errors) {
            return callback(body.errors);
        }
        return callback(body.id);
    });
}

module.exports = Canvas;
