const path = require('path');

module.exports = {
    hostPort: 8000,

    sessionOptions: {
        secret: 'confusion',
        saveUninitialized: false,
        resave: false
    },

    projectPath(rel) { return path.join(__dirname, '..', rel) },
    cloudDir: path.join(__dirname, '..', 'cloudDir'),

    db: {
        host: 'localhost',
        database: 'comp4310',
    },

};