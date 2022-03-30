// schemas
const User = require('../../models/user');
const Course = require('../../models/course');

// populate??? advanced mongoose 27:00

// handle parameters
async function lookupUser(req, res, next, userid)
{
    try
    {
        if (userid.length > 20)
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
            userNotFound(req, res);
        }
    }
    catch (err)
    {
        next(err);
    }
}

// middleware
async function showAllUsers(req, res, next)
{
    try
    {
        let users = await User.find({}, ['_id', 'username']);   // can get rid of id
        res.json(users);
    }
    catch
    {
        next(err);
    }
}

function showUser(req, res, next)
{
    res.json(res.locals.user);
}

async function createUser(req, res, next)
{
    try
    {
        const user = new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        await user.save();
        res.json(user);
    }
    catch (err)
    {
        console.log('agh');
        next(err);
    }
}

async function updateUser(req, res,next)
{
    try
    {
        let user = res.locals.user;
        user.text = req.body.text;
        user.done = req.body.done;
        await user.save();
        res.json(user);
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
        let user = res.locals.user;
        await user.remove();
        res.json(user);
    }
    catch (err)
    {
        next(err);
    }
}

async function showCoursesForUser(req, res, next)       // redo
{
    try
    {
        // await res.locals.user.populate('teacher', ['firstname', 'lastname']);

        // res.locals.user.teacher = await User.findById(res.locals.user.teacher, ['firstname', 'lastname']);
        // for (let course of courses) {
        //     course.teacher = await User.findById(course.teacher, ['firstname', 'lastname']);
        // }

        courses = await Course.find({ teacher: res.locals.user });
        // courses = await Course.find({ user: res.locals.user });

        res.json(courses);
    }
    catch
    {
        next(err);
    }
}

// handle errors
function userNotFound(req, res)
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
    if (err.name === 'SyntaxError' || err.name === 'ValidationError' || (err.name === 'MongoServerError' && err.code === '11000'))
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
    showAllUsers,
    showUser,
    createUser,
    updateUser,
    deleteUser,
    showCoursesForUser,
    userNotFound,
    methodNotSupported,
    internalError
};
