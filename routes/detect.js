// curl -X POST "https://api-us.faceplusplus.com/facepp/v3/detect" -F "api_key=<api_key>" \
// -F "api_secret=<api_secret>" \
// -F "image_file=@image_file.jpg" \
// -F "return_landmark=1" \
// -F "return_attributes=gender,age"

// var formData = {
//   // Pass a simple key-value pair
//   api_key: 6vx_JevDZSHqYEsiiGkSQIGYCU_W9vs0,

//   api_secret: FJ_kRVr-KcoPGlv7B4Ubro4i-7r2u-q5,

//   // Pass data via Streams
//   image_file: fs.createReadStream(__dirname + '/images/Photo.jpg'),

//   return_landmark: 1,

//   return_attributes: 'gender,age'
// };


// request.post({url:'https://api-us.faceplusplus.com/facepp/v3/detect', formData: formData}, function optionalCallback(err, httpResponse, body) {
//   if (err) {
//     return console.error('upload failed:', err);
//   }
//   console.log('Upload successful!  Server responded with:', body);
// });



var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
require('dotenv').config();
/* GET users listing. */
router.post('/', function(req, res, next) {

	// console.log(req.file);
	// res.send("Hi");

    var formData = {
        // Pass a simple key-value pair
        api_key: process.env.API_KEY,

        api_secret: process.env.API_SECRET,

        // Pass data via Streams
        image_file: fs.createReadStream(req.file.path),
        // image_file: req.file.path,

        return_landmark: '1',

        return_attributes: 'gender,age'
    };

    // var response;

    request.post({ url: 'https://api-us.faceplusplus.com/facepp/v3/detect', formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        // response = body;
        res.send(body);
    });

    //Здесь сделать проверку
    // if(response) {
    //     res.send(response);
    // }
    // else {
    //     res.send("Error");
    // }

});

module.exports = router;