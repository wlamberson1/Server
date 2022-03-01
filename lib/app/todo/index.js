const express = require('express');
const mid = require('./middleware');

const router = express.Router();

router.get('/', mid.redirect);
router.get('/list', mid.dispList);
router.post('/add', mid.add);
router.post('/save', mid.save);
router.post('/remove', mid.remove);

module.exports = { router };
