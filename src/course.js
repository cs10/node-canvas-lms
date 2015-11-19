/** Course
 *  A course is a Canvas instance that is designed to
 */

var Canvas = require('./canvas.js');


// Course Inherits from a Canvas object.
Course.prototype = Object.create(Canvas.prototype);
Course.prototype.constructor = Course;
Course.uber = Canvas.prototype;


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
    // this.accessToken = this.canvas.accessToken;
    // this.apiVersion = this.canvas.apiVersion;
    // this.host = this.canvas.host;

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

Course.prototype.URL_BASE = 'courses/';

Course.prototype._buildApiUrl = function (endpoint) {
    return Course.uber._buildApiUrl.call(
        this.canvas,
        `${this.URL_BASE}${this.courseIDType}${this.id}/${endpoint}`);
}

Course.prototype._http = function (options, cb) {
    console.log('Course http called...');
    return Course.uber._http.call(this.canvas, options, cb);
}

// Add a function to a Canvas Object to create an instance of a Course
Canvas.prototype.Course = function (id, options) {
    this.courses = this.courses instanceof Array || [];
    var course = new Course(id, options, this);
    this.courses.push(course);
    return course;
}

module.exports = Course;