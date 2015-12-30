// A simple test suite. This requires access to my canvas course.
// 

var assert = require('assert');

var Canvas = require('../');
var Course = Canvas.Course;

var demo_course = new Course('1268501', {
        host: 'https://bcourses.berkeley.edu',
        token: process.env.CANVAS_TOKEN,
    });
    
demo_course.get('students', function (err, resp, body) {
    console.log('Error?  ', err);
    console.log('Headers:  ', resp.headers);
    console.log('url:  ', resp.url);
    assert.equal(body.length, 22);
    console.log('Get Students: Success');
});
