const session = require('express-session');
const { download } = require('express/lib/response');
const config = require('../../config');
const cloudDir = config.cloudDir;
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
    console.log(req.query);
    // try
    // {
        if ("download" in req.query)
        {
            console.log('it worked!');

            // ISSUE

            res.download(config.projectDir(path));
        }
        else
        {
            let stats = await fs.stat(path);
            if (stats.isDirectory())
            {
                await makeDirArray(path);
                res.render('directoryListing.hbs', { dirArray: dirArray, shortPath: shortPath });
            }
            else if (stats.isFile())
            {
                res.sendFile(config.projectDir(path));
            }
            else
            {
                next("Not a valid file or directory.")
            }
        }
    // }
    // catch(err)
    // {
    //     res.render('error.hbs', { message: 'The file provided does not exist.' })
    // }
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
    console.log(dirArray);
}







var toDoList = [];
class Item { item; status; }

function redirect(req, res, next)
{
    res.redirect(303, req.baseUrl + '/list');
}

function dispList (req, res, next)
{
    req.session.toDoList = toDoList;
    res.render('todoList.hbs', { toDoList: req.session.toDoList });
}

function add(req, res, next)
{
    if (!(req.session.toDoList === undefined))
    {
        toDoList = req.session.toDoList;
    }
    else
    {
        req.session.toDoList = toDoList;
    }

    let item = req.body.item;
    let toDoItem = new Item();
    toDoItem.item = item;
    toDoItem.status = "checkbox";

    toDoList.push(toDoItem);
    req.session.toDoList = toDoList;

    //req.session;
    req.session.save(() => {
        res.redirect(303, 'list');
    });
}

function save(req, res, next)
{
    if (!(req.session.toDoList === undefined))
    {
        toDoList = req.session.toDoList;
    }
    else
    {
        req.session.toDoList = toDoList;
    }

    for (i = 0; i < toDoList.length; i++)
    {
        console.log(req.body['item-' + i]);
        if(req.body['item-' + i] == "done")
        {
            toDoList[i]['status'] = "checked";
        }
        else
        {
            toDoList[i]['status'] = "checkbox";
        }
    }
    req.session.toDoList = toDoList;

    //req.session;
    req.session.save(() => {
        res.redirect(303, 'list');
    });
}

function remove(req, res, next)
{
    if (!(req.session.toDoList === undefined))
    {
        toDoList = req.session.toDoList;
    }
    else
    {
        req.session.toDoList = toDoList;
    }

    for (i = 0; i < toDoList.length; i++)
    {
        console.log(req.body['item-' + i]);
        if(req.body['item-' + i] == "done")
        {
            delete toDoList[i];
        }
        else
        {
            toDoList[i]['status'] = "checkbox";
        }
    }
    req.session.toDoList = toDoList;

    //req.session;
    req.session.save(() => {
        res.redirect(303, 'list');
    });
}

module.exports = { home }