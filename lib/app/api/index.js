const express = require('express');
const bodyParser = require('body-parser');
const mid = require('./middleware');

const router = express.Router();

router.use(bodyParser.json());

// handle parameters
router.param('userid', mid.lookupUser);
// router.param('courseid');

// interacting with User documents
router.get('/users', mid.showAllUsers);       // returns a list of all users (only populate id and username)
router.post('/users', mid.createUser);        // creates a new user
router.all('/users', mid.methodNotSupported);

router.get('/users/:userid', mid.showUser);   // gets a specific user (populate all fields)
router.put('/users/:userid', mid.updateUser);                   // updates a specific user
router.delete('/users/:userid', mid.deleteUser);                // deletes a specific user
router.all('/users/:userid', mid.methodNotSupported);

// interacting with Course documents
// router.get('/courses');                         // returns a list of all courses (id, subject, number)
// router.post('/courses');                        // creates a new course
router.all('/courses', mid.methodNotSupported);

// router.get('/courses/:courseid');               // gets a specific course (polulate all but students)
// router.put('/courses/:courseid');               // updates a specific course
// router.delete('/courses/:courseid');            // deletes a specific course
router.all('/courses/:courseid', mid.methodNotSupported);

router.get('/courses/users/:userid', mid.showCoursesForUser);     // gets all courses for specific user/teacher (id, subject, number)
router.all('/courses/users/:userid', mid.methodNotSupported);

// interacting with students in a class
// router.get('/rosters/:classid');                // returns a list of all students in a particular class (all)
router.all('/rosters/:classid', mid.methodNotSupported);

// router.put('/rosters/:classid/:userid');        // adds a student to a class
// router.delete('/rosters/:classid/:userid');     // removes a student from a class
router.all('/rosters/:classid/:userid', mid.methodNotSupported);

router.use(mid.userNotFound);
router.use(mid.internalError);

module.exports = { router };
