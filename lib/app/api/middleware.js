// schemas
const User = require('../../models/user');
const Course = require('../../models/course');
const Assignment = require('../../models/assignment');



// parameters
async function lookupUser(req, res, next, userid)
{
    try
    {
        res.locals.userid = userid;
        if (userid.length > 22)
        {
            res.locals.user = await User.findById(userid);
        }
        else
        {
            res.locals.user = await User.findOne({ username: userid });
        }

        if (res.locals.user)
        {
            next();
        }
        else
        {
            notFound(req, res);
        }
    }
    catch (err)
    {
        next(err);
    }
}

async function lookupCourse(req, res, next, courseid)
{
    try
    {
        let match = courseid.match(/^([a-zA-Z]{4})(\d{4})$/);
        if (match)
        {
            let subjectid = match[1].toUpperCase();
            let numberid = Number(match[2]);
            res.locals.course = await Course.findOne({ subject: subjectid, number: numberid });
        }
        else
        {
            res.locals.course = await Course.findById(courseid);
        }

        if (res.locals.course)
        {
            next();
        }
        else
        {
            notFound(req, res);
        }
    }
    catch (err)
    {
        next(err);
    }
}

async function lookupClass(req, res, next, classid)
{
    try
    {
        let match = classid.match(/^([a-zA-Z]{4})(\d{4})$/);
        if (match)
        {
            let subjectid = match[1].toUpperCase();
            let numberid = Number(match[2]);
            res.locals.course = await Course.findOne({ subject: subjectid, number: numberid });
        }
        else
        {
            res.locals.course = await Course.findById(classid);
        }

        if (res.locals.course)
        {
            next();
        }
        else
        {
            notFound(req, res);
        }
    }
    catch (err)
    {
        next(err);
    }
}



// middleware
// users
async function showAllUsers(req, res, next)
{
    try
    {
        let users = await User.find({}, ['_id', 'username']);
        res.json(users);
    }
    catch
    {
        next(err);
    }
}

async function createUser(req, res, next)
{
    try
    {
        let user = new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        });
        await user.save();
        res.json(user);
    }
    catch (err)
    {
        next(err);
    }
}

function showUser(req, res, next)
{
    res.json(res.locals.user);
}

async function updateUser(req, res,next)
{
    try
    {
        coursesTeacher = await Course.find({ teacher: res.locals.user }, ['_id', 'subject', 'number']);
        coursesStudent = await Course.find({ students: res.locals.user }, ['_id', 'subject', 'number']);
        courses = { teacher: coursesTeacher, student: coursesStudent };

        if (courses.teacher.length === 0 && courses.student.length === 0)
        {
            let user = res.locals.user;
            user.username = req.body.username;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            await user.save();
            res.json(user);
        }
    }
    catch (err)
    {
        next(err);
    }
}

async function deleteUser(req, res, next)
{
    try
    {
        coursesTeacher = await Course.find({ teacher: res.locals.user }, ['_id', 'subject', 'number']);
        coursesStudent = await Course.find({ students: res.locals.user }, ['_id', 'subject', 'number']);
        courses = { teacher: coursesTeacher, student: coursesStudent };

        if (courses.teacher.length === 0 && courses.student.length === 0)
        {
            let user = res.locals.user;
            await user.remove();
            res.json(user);
        }
    }
    catch (err)
    {
        next(err);
    }
}


// courses
async function showAllCourses(req, res, next)
{
    try
    {
        let courses = await Course.find({}, ['_id', 'subject', 'number']);
        res.json(courses);
    }
    catch
    {
        next(err);
    }
}

async function createCourse(req, res, next)
{
    try
    {
        if (req.body.teacher.length > 22)
        {
            var course = new Course({
                subject: req.body.subject,
                number: req.body.number,
                title: req.body.title,
                teacher: await User.findById(req.body.teacher, ['_id', 'firstname', 'lastname'])
            });
        }
        else
        {
            var course = new Course({
                subject: req.body.subject,
                number: req.body.number,
                title: req.body.title,
                teacher: await User.findOne({ username: req.body.teacher }, ['_id', 'firstname', 'lastname'])
            });
        }
        await course.save();
        let courseReturn = await Course.find(course, ['_id', 'subject', 'number', 'title', 'teacher']).populate('teacher', ['id', 'firstname', 'lastname']);
        res.json(courseReturn[0]);
    }
    catch (err)
    {
        next(err);
    }
}

async function showCourse(req, res, next)
{
    try
    {
        let course = await Course.find(res.locals.course, ['_id', 'subject', 'number', 'title', 'teacher']).populate('teacher', ['id', 'firstname', 'lastname']);
        res.json(course[0]);
    }
    catch (err)
    {
        next(err);
    }
}

async function updateCourse(req, res, next)
{
    try
    {
        assignments = await Assignment.find({ course: res.locals.course }, ['_id', 'title', 'due', 'course']);

        if (assignments.length === 0)
        {
            let course = res.locals.course;
            course.subject = req.body.subject;
            course.number = req.body.number;
            course.title = req.body.title;

            if (req.body.teacher.length > 22)
            {
                course.teacher = await User.findById(req.body.teacher, ['_id', 'firstname', 'lastname']);
            }
            else
            {
                course.teacher = await User.findOne({ username: req.body.teacher }, ['_id', 'firstname', 'lastname']);
            }
            await course.save();
            let courseReturn = await Course.find(course, ['_id', 'subject', 'number', 'title', 'teacher']).populate('teacher', ['id', 'firstname', 'lastname']);
            res.json(courseReturn[0]);
        }
    }
    catch (err)
    {
        next(err);
    }
}

async function deleteCourse(req, res, next)
{
    try
    {
        assignments = await Assignment.find({ course: res.locals.course }, ['_id', 'title', 'due', 'course']);

        if (assignments.length === 0)
        {
            let course = await Course.find(res.locals.course, ['_id', 'subject', 'number', 'title', 'teacher']).populate('teacher', ['id', 'firstname', 'lastname']);;
            await res.locals.course.remove();
            res.json(course[0]);
        }
    }
    catch (err)
    {
        next(err);
    }
}

async function showCoursesForUser(req, res, next)
{
    try
    {
        coursesTeacher = await Course.find({ teacher: res.locals.user }, ['_id', 'subject', 'number']);
        coursesStudent = await Course.find({ students: res.locals.user }, ['_id', 'subject', 'number']);

        courses = { teacher: coursesTeacher, student: coursesStudent };

        res.json(courses);
    }
    catch
    {
        next(err);
    }
}


// rosters
async function showStudents(req, res, next)
{
    try
    {
        let course = await Course.find(res.locals.course, ['students']).populate('students');
        res.json(course);
    }
    catch (err)
    {
        next(err);
    }
}

async function addStudent(req, res, next)
{
    try
    {
        let course = res.locals.course;

        course.students.push(res.locals.user);

        await course.save();
        res.json(res.locals.userid);
    }
    catch (err)
    {
        next(err);
    }
}

async function removeStudent(req, res, next)
{
    try
    {
        let course = res.locals.course;

        await course.students.remove();
        
        res.json(res.locals.userid);
    }
    catch (err)
    {
        next(err);
    }
}



// error handling
function notFound(req, res)
{
    res.status(404);
    res.json({ message: `Resource ${req.originalUrl} not found` });
}

function methodNotSupported(req, res)
{
    res.status(405);
    res.json({ message: `The resource ${req.originalUrl} does not support ${req.method} requests`});
}

function internalError(err, req, res, next)
{
    if (err.name === 'SyntaxError' || err.name === 'ValidationError' || (err.name === 'MongoServerError' && err.code == 11000))
    {
        res.status(400);
        res.json({ message: err.message });
    }
    else
    {
        console.error(err);
        res.status(500);
        res.json({ message: "Internal server error" });
    }
}

module.exports = {
    lookupUser,
    lookupCourse,
    lookupClass,
    showAllUsers,
    createUser,
    showUser,
    updateUser,
    deleteUser,
    showAllCourses,
    createCourse,
    showCourse,
    updateCourse,
    deleteCourse,
    showCoursesForUser,
    showStudents,
    addStudent,
    removeStudent,
    notFound,
    methodNotSupported,
    internalError
};
