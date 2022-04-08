const express = require('express');
const bodyParser = require('body-parser');
const mid = require('./middleware');

const router = express.Router();

router.use(bodyParser.json());

// handle parameters
router.param('userid', mid.lookupUser);
router.param('courseid', mid.lookupCourse);
router.param('classid', mid.lookupClass);

// interacting with User documents
router.get('/users', mid.showAllUsers);
router.post('/users', mid.createUser);
router.all('/users', mid.methodNotSupported);

router.get('/users/:userid', mid.showUser);
router.put('/users/:userid', mid.updateUser);
router.delete('/users/:userid', mid.deleteUser);
router.all('/users/:userid', mid.methodNotSupported);

// interacting with Course documents
router.get('/courses', mid.showAllCourses);
router.post('/courses', mid.createCourse);
router.all('/courses', mid.methodNotSupported);

router.get('/courses/:courseid', mid.showCourse);
router.put('/courses/:courseid', mid.updateCourse);
router.delete('/courses/:courseid', mid.deleteCourse);
router.all('/courses/:courseid', mid.methodNotSupported);

router.get('/courses/users/:userid', mid.showCoursesForUser);
router.all('/courses/users/:userid', mid.methodNotSupported);

// interacting with students in a class
router.get('/rosters/:classid', mid.showStudents);                // returns a list of all students in a particular class (all)
router.all('/rosters/:classid', mid.methodNotSupported);

router.put('/rosters/:classid/:userid', mid.addStudent);
router.delete('/rosters/:classid/:userid', mid.removeStudent);     // removes a student from a class
router.all('/rosters/:classid/:userid', mid.methodNotSupported);

router.use(mid.notFound);
router.use(mid.internalError);

module.exports = { router };
