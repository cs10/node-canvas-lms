var Canvas = require('./canvas.js');


function Course() {
    return this
}

Course.prototype = Canvas.prototype;
Course.super = Canvas;

module.exports = Course;