var express = require('express');
var router = express.Router();

var faceController = require('../controllers/face.js');

/* GET users listing. */
router.post('/', faceController.add);

module.exports = router;
