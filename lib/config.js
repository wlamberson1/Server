const path = require('path');

module.exports = {
    hostPort: 8000,

    sessionOptions: {
        secret: 'confusion',
        saveUninitialized: false,
        resave: false
    },

    projectDir(rel) { return path.join(__dirname, '..', rel) },
    // cloudDir: this.projectDir + 'cloudDir'
    cloudDir: 'cloudDir'

};