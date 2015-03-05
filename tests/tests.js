var Canvas = require('./lib/canvas');

var cs10 = new Canvas('https://bcourses.berkeley.edu',
    { token: process.env.CANVAS_TOKEN,
    });


function cs10Students() {
    // CS10 Fall 2014 Class ID
    cs10.get('/courses/1246916/students', '', function(body) {
        students = body;
        console.log('made call');
        console.log('\n\n');
        sep = '  -- ';
        prev_sid = '';
        for (var i = 0; i < students.length; i++) {
            s = students[i];
            if (s.sis_login_id !== prev_sid) {
                console.log(s.sortable_name + sep + s.name + sep + s.sis_login_id);
                prev_sid = s.sis_login_id;
            }
        }
    });
};

/* Assignment JSON Response
     { assignment_group_id: 1593713,
       automatic_peer_reviews: false,
       created_at: '2014-08-28T07:34:36Z',
       description: '',
       due_at: '2014-12-02T07:59:59Z',
       grade_group_students_individually: null,
       grading_standard_id: null,
       grading_type: 'points',
       group_category_id: null,
       id: 5359332,
       lock_at: null,
       peer_reviews: false,
       points_possible: 2,
       position: 18,
       post_to_sis: null,
       unlock_at: null,
       updated_at: '2014-08-28T07:34:42Z',
       course_id: 1268501,
       name: '18. Python 4 (11/19-11/21)',
       submission_types: [Object],
       has_submitted_submissions: false,
       muted: false,
       html_url: 'https://bcourses.berkeley.edu/courses/1268501/assignments/5359332',
       needs_grading_count: 0,
       integration_id: null,
       integration_data: null,
       published: false,
       unpublishable: true,
       locked_for_user: false }
*/
/*
1. Intro to Snap! (8/28-8/29)
5359333
2. Build Your Own Blocks (9/1-9/3)
5359334
*/
function getLabsCheckOffs() {
    // bCourses "Michael Sanbox" Course ID
    cs10.get('/courses/1268501/assignment_groups/1593713?include[]=assignments', '', function(body) {
        var assn = body.assignments;
        // console.log(assn);
        for(var i = 0; i < assn.length; i++) {
            item = assn[i]
            console.log(item.name);
            console.log(item.id);
        }
    })
}

// PUT /courses/:course_id/assignments/:assignment_id/submissions/:user_id
// cs10.put('/courses/1268501/assignments/5359333/submissions/sis_user_id:22869160',
// '', 'submission[posted_grade]=4', function(body) {
//     console.log(body);
// })

// thing = cs10.get('/courses/1268501/assignments/5359333/submissions/',
// '', function() {return;});
//
// console.log('thing')
// console.log(thing);
//
// thing = cs10.get('/courses/1268501/assignments/', '', function() {return;});

console.log(process.env.CANVAS_TOKEN);
cs10.getID('sis_user_id', 22942141, function(body) {
        console.log(body);
});
