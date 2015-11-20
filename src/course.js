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
        // Shortcut: Use the options object to create a new Canvas object
        return new Canvas(options.host, options).Course(id, options);
    }

    this.options = options || {};

    this.id = id;
    this.canvas = canvas;
    this.name = this.canvas.name + ' Course ' + id || this.options.name;

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

Course.prototype._http = function (method, args) {
    return Course.uber._http.call(this.canvas, method, args);
}

// Add a function to a Canvas Object to create an instance of a Course
Canvas.prototype.Course = function (id, options) {
    this.courses = this.courses instanceof Array || [];
    var course = new Course(id, options, this);
    this.courses.push(course);
    return course;
}

module.exports = Course;