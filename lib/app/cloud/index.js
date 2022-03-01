const express = require('express');
const mid = require('./middleware');

const router = express.Router();

router.use('/', mid.home);

module.exports = { router };
