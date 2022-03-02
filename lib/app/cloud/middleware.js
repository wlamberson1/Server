const { download } = require('express/lib/response');
const { copyFileSync } = require('fs');
const config = require('../../config');
const path = require('path');
const cloudDir = path.basename(config.cloudDir);
const fs = require('fs').promises;

var myPath;
var shortPath;
var dirArray = [];
class item{ name; path; isDir; }

async function home(req, res, next)
{
    res.locals.path = cloudDir + req.path;
    myPath = cleanUrl(res.locals.path);
    shortPath = myPath.slice(cloudDir.length + 1);
    try
    {
        let stats = await fs.stat(myPath);
        if (stats.isDirectory())
        {
            await makeDirArray(myPath);
            res.render('cloud/directoryListing.hbs', { dirArray: dirArray, shortPath: shortPath });
        }
        else if (stats.isFile())
        {
            if ("download" in req.query)
            {
                res.download(config.projectPath(myPath));
            }
            else
            {
                res.sendFile(config.projectPath(myPath));
            }
        }
        else
        {
            next("Not a valid file or directory.")
        }
    }
    catch(err)
    {
        res.status(404);
        res.render('error.hbs', { message: 'The file provided does not exist.' })
    }
}

async function action(req, res, next)
{
    try
    {
        console.log('From: ' + req.file.path)
        console.log('To: ' + config.cloudDir + req.path + req.file.originalname);
        await fs.rename(req.file.path, config.cloudDir + req.path + req.file.originalname);
        res.redirect(303, '.');
    }
    catch(err)
    {
        res.status(404);
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