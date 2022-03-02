const { download } = require('express/lib/response');
const { copyFileSync } = require('fs');
const config = require('../../config');
const cloudDir = config.cloudDirty;
const fs = require('fs').promises;

var path;
var shortPath;
var dirArray = [];
class item{ name; path; isDir; }

async function home(req, res, next)
{
    res.locals.path = cloudDir + req.path;
    path = cleanUrl(res.locals.path);
    shortPath = path.slice(cloudDir.length + 1);
    try
    {
        let stats = await fs.stat(path);
        if (stats.isDirectory())
        {
            await makeDirArray(path);
            res.render('cloud/directoryListing.hbs', { dirArray: dirArray, shortPath: shortPath });
        }
        else if (stats.isFile())
        {
            if ("download" in req.query)
            {
                res.download(config.projectPath(path));
            }
            else
            {
                res.sendFile(config.projectPath(path));
            }
        }
        else
        {
            next("Not a valid file or directory.")
        }
    }
    catch(err)
    {
        res.render('error.hbs', { message: 'The file provided does not exist.' })
    }
}

async function action(req, res, next)
{
    try
    {
            await fs.rename(req.file.path, config.cloudDir + '/' + req.path.substring(0, req.path.length - 6) + req.file.originalname);
            res.redirect(303, './');
    }
    catch(err)
    {
        res.render('error.hbs', { message: 'The file provided does not exist.' })
    }
}




// private methods

function cleanUrl(oldPath)
{
    // clean url
    newUrl = '';
    let newPath = oldPath.replace('/../', '/');

    return newPath;
}

async function makeDirArray(dirName)
{
    let names = await fs.readdir(dirName);
    let paths = [];
    let isDirs = [];
    let promises = [];

    for (let entry of names)
    {
        paths.push(entry);
        promises.push(await fs.stat(dirName + entry));
    }

    let stats = await Promise.all(promises);
    for (let i = 0; i < names.length; i++)
    {
        if (stats[i].isDirectory())
        {
            paths[i] += '/', '(directory)';
            isDirs[i] = true;
        }
    }

    dirArray = [];
    for (let i = 0; i < names.length; i++)
    {
        let newItem = new item();
        newItem.name = names[i];
        newItem.path = paths[i];
        newItem.isDir = isDirs[i];
        dirArray.push(newItem);
    }
}

module.exports = { home, action }