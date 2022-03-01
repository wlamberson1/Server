function notFound(req, res)
{
    res.status(404);
    res.render('notfound.hbs', { url: req.originalUrl });
}

function serverError(err, req, res, next)
{
    console.error(err);
    res.status(500);
    res.render('serverError.hbs', {message: err});
}

module.exports = { notFound, serverError };