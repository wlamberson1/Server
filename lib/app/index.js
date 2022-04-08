const bodyParser = require('body-parser');
const express = require('express');
const sessionFileStore = require('session-file-store');
const expressHandlebars = require('express-handlebars');
const expressSession = require('express-session');
const morgan = require('morgan');

// Common
const config = require('../config');
const common = require('./commonMiddleware');

// Features
const todo = require('./todo');
const cloud = require('./cloud');
const api = require('./api');

// Create custom file-store class
const FileStore = sessionFileStore(expressSession);

const app = express();

// Use Handlebars for files ending with the '.hb' file extension
app.engine('hbs', expressHandlebars.engine({ defaultLayout: null, extname: '.hbs' }));

// Logging
app.use(morgan('dev'));

// Request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sessions
app.use(expressSession({
    ...config.sessionOptions,
    store: new FileStore()
}));

// Static
app.use(express.static('./static'));

// Mount Features
app.use('/todo', todo.router);
app.use('/cloud', cloud.router);
app.use('/api', api.router);

// Mount Common Features
app.use(common.notFound);

module.exports = app;
