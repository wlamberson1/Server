const path = require('path');

module.exports = {
    hostPort: 8000,

    sessionOptions: {
        secret: 'confusion',
        saveUninitialized: false,
        resave: false
    },

    projectPath(rel) { return path.join(__dirname, '..', rel) },
    cloudDirty: 'cloudDir',
    cloudDir: path.join(__dirname, '..', 'cloudDir')

};