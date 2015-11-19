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

Canvas.prototype._http = function (options, callback) {
    options.headers = {
        Authorization: 'Bearer ' + this.accessToken
    };
    options.json = true;
    options.useQuerystring = true;

    return request(options, function (error, response, body) {
        return callback(error, response, body);
    });
};

Canvas.prototype.delete = function (endpoint, querystring) {
    var options = {
        method: 'DELETE',
        url: this._buildApiUrl(endpoint),
        qs: querystring
    };
    return this._http(options);
};

Canvas.prototype.get = function (endpoint, querystring, callback) {
    var options = {
        method: 'GET',
        url: this._buildApiUrl(endpoint),
        qs: querystring
    };
    return this._http(options, callback);
};

Canvas.prototype.post = function (endpoint, querystring, form, callback) {
    var options = {
        method: 'POST',
        url: this._buildApiUrl(endpoint),
        qs: querystring,
        form: form
    };
    return this._http(options, callback);
};

Canvas.prototype.put = function (endpoint, querystring, form, callback) {
    var options = {
        method: 'PUT',
        url: this._buildApiUrl(endpoint),
        qs: querystring,
        form: form,
    };
    return this._http(options, callback);
};

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
