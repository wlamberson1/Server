const express = require('express');
const mid = require('./middleware');
const config = require('../../config');
const multer = require('multer');

let cloudDir = config.cloudDir;
const upload = multer({ dest: cloudDir });

const router = express.Router();

router.post('/upload',upload.single('file'), mid.action);
router.use('/', mid.home);

module.exports = { router };
