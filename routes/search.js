var express = require('express');
var router = express.Router();

var userController = require('../controllers/user.js');

/* GET users listing. */
router.post('/', userController.search);

module.exports = router;
