var Canvas = require('./canvas.js');

function Course(id, options, canvas) {
    if (!canvas) {
        // Shortcut: Use the options object to create a new Canvas object.
        return new Course(id, options, new Canvas(options.host, options));
    }

    this.options = options || {};

    this.id = id;
    this.canvas = canvas;
    this.name = this.canvas.name + ' Course ' + id || this.options.name;

    // Copy Canvas obj params.
    // allows `this` to work correctly in Canvas functions.
    // TODO: Better OOP-y way of doing this?
    this.accessToken = canvas.accessToken;
    this.apiVersion = canvas.apiVersion;
    this.host = canvas.host;

    this.studentIDType = '';
    if (this.options.studentIDType) {
        this.studentIDType = this.options.studentIDType + ':';
    }

    this.courseIDType = '';
    if (this.options.courseIDType) {
        this.courseIDType = this.options.courseIDType + ':';
    }

    return this;
}

// Course Inherits from a Canvas object.
Course.prototype = Object.create(Canvas.prototype);
Course.prototype.constructor = Course;
Course.uber = Canvas.prototype;

Course.prototype.URL_BASE = '/courses/';

Course.prototype._buildApiUrl = function (endpoint) {
    return this.uber._buildApiUrl(`${this.URL_BASE}${this.id}/`);
}

// Add a function to a Canvas Object to create an instance of a Course
Canvas.prototype.Course = function (id, options) {
    this.courses = this.courses instanceof Array || [];
    var course = new Course(id, options, this);
    this.courses.push(course);
    return course;
}

module.exports = Course;