var express = require('express');
var router = express.Router();
var request = require('request');
require('dotenv').config();

router.post('/', function(req, res, next) {
    var formData = {
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        image_base64: req.body.image_base64,
        return_landmark: '1',
        return_attributes: 'gender,age'
    };

    request.post({ url: 'https://api-us.faceplusplus.com/facepp/v3/detect', formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        res.send(body);
    });
});

module.exports = router;
