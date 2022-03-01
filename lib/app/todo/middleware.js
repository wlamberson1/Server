const session = require('express-session');
const path = require('path');

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

module.exports = { redirect, dispList, add, save, remove }