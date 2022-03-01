const session = require('express-session');
const config = require('../../config');
const cloudDir = config.cloudDir;
const fs = require('fs').promises;

var path;
var shortPath;
var dirArray = [];
class item{ name; path; }

async function home(req, res, next)
{
    res.locals.path = cloudDir + req.url;
    path = cleanUrl(res.locals.path);
    shortPath = path.slice(cloudDir.length + 1);
    console.log(req.query);
    // try
    // {
        if ("download" in req.query)
        {
            console.log('it worked!');

            // ISSUE


            res.download(config.projectDir(path), req.Url);
        }
        else
        {
            let stats = await fs.stat(path);
            if (stats.isDirectory())
            {
                path = cleanDirUrl(path);
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

function cleanDirUrl(oldPath)
{
    // clean url
    newUrl = '';
    let newPath = oldPath.replace('/../', '/');
    newUrl = newPath;
    if (oldPath.match(/\/(\?|$)/))
    {
        // ends with a slash
    }
    else
    {
        // does not end with a slash
        // add a slash
        newPath = newUrl.replace(/(\?|$)/, '/$1');
    }

    return newPath;
}

async function makeDirArray(dirName)
{
    let names = await fs.readdir(dirName);
    let paths = [];
    let promises = [];

    for (let entry of names)
    {
        paths.push(shortPath + entry);
        promises.push(await fs.stat(dirName + entry));
    }

    // let stats = await Promise.all(promises);
    // for (let i = 0; i < names.length; i++)
    // {
    //     if (stats[i].isDirectory())
    //     {
    //         console.log(names[i], '(directory)');
    //     }
    //     else if (stats[i].isFile())
    //     {
    //         console.log(names[i], '(file)');
    //     }
    //     else
    //     {
    //         console.log(names[i], '(?)');
    //     }
    // }

    dirArray = [];
    for (let i = 0; i < names.length; i++)
    {
        let newItem = new item();
        newItem.name = names[i];
        newItem.path = paths[i];
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