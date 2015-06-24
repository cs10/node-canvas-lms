var Canvas = require('./canvas.js');

function Course(canvas, options) {
    if (canvas instanceof Object) {
        // An options object is passed instead of a Canvas instance
        var options = canvas;
        var newCanvas = new Canvas(canvas);
        return new Course(newCanvas, options);
    }

    this.id = options.id;
    this.name = this.canvas.name + ' Course ' + ('' || options.name);

    this.studentIDType = '';
    if (options.studentIDType) {
        this.studentIDType = options.studentIDType + ':'
    }

    this.courseIDType = '';
    if (options.courseIDType) {
        this.courseIDType = options.courseIDType + ':'
    }

    return this;
}

Course.prototype = Canvas.prototype;
Course.super = Canvas;

Course.prototype.URL_BASE = ''


// Add a function to a Canvas Object to create an instance of a Course
Canvas.prototype.Course = function(options) {
    this.courses = this.courses instanceof Array || [];
    var course = new Course(this, params);
    this.courses.push(course);
    return course;
}

module.exports = Course;