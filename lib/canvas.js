'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var resolve = require('url').resolve;

function Canvas(host, options) {
    options = options || {};
    this.name = 'canvas';
    this.accessToken = options.accessToken || options.token || '';
    this.apiVersion = options.apiVersion || options.version || 'v1';
    this.host = host;
}

function buildApiUrl(endpoint) {
    if (endpoint.substring(0, 1) != '/') {
        endpoint = '/' + endpoint;
    }
    return resolve(this.host,  '/api/' + this.apiVersion + endpoint);
}

Canvas.prototype.delete = function (endpoint, querystring) {
    var options = {
        method: 'DELETE',
        url: buildApiUrl(endpoint),
        qs: querystring
    };
    return http(options);
};

Canvas.prototype.get = function (endpoint, querystring) {
    var options = {
        method: 'GET',
        url: buildApiUrl(endpoint),
        qs: querystring
    };
    return http(options);
};

function http(options) {
    options.headers = {
        Authorization: 'Bearer ' + this.accessToken
    };
    options.json = true;
    return request(options)
        .spread(function (response, body) {
            if (isHttpError(response)) {
                return Promise.reject(body.errors)
            }
            return body;
        })
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

Canvas.prototype.post = function (endpoint, querystring, form) {
    var options = {
        method: 'POST',
        url: buildApiUrl(endpoint),
        qs: querystring,
        form: form
    };
    return http(options);
};

Canvas.prototype.put = function (endpoint, querystring, form) {
    var options = {
        method: 'PUT',
        url: buildApiUrl(endpoint),
        qs: querystring,
        form: form
    };
    return http(options);
};

module.exports = Canvas;
