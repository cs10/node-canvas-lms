/** Course
 *  A course is a Canvas instance that is designed to
 */
var url = require('url');

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
    this.parent = canvas;
    this.name = this.options.name || this.parent.name + ' Course ' + id;
    
    // FIXME -- duplication shouldn't be necessary?
    //this.accessToken = this.parent.accessToken;

    // FUTURE: Ensure these match a valid canvas format?
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

Course.prototype.COURSE_URL = 'courses';

Course.prototype.resloveURL = function (endpoint) {
    var prefix;
    
    prefix = `${this.COURSE_URL}/${this.courseIDType}${this.id}`
    prefix += endpoint.startsWith('/') ? '' : '/';
    
    return url.resolve(
        this.parent.host,
        `/api/${this.parent.apiVersion}/${prefix}${endpoint}`
    );
}

// Add a function to a Canvas Object to create an instance of a Course
Canvas.prototype.Course = function (id, options) {
    this.courses = this.courses instanceof Array || [];
    var course = new Course(id, options, this);
    this.courses.push(course);
    return course;
}

module.exports = Course;