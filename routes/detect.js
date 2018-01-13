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
var Jimp = require("jimp");
require('dotenv').config();
/* GET users listing. */

function cropImage(filePath, options) {
	console.log("crop: ", filePath);
	Jimp.read(filePath).then(function (image) {
  	image.crop( options.x, options.y, options.w, options.h )
         .write("./crop/" + options.i + ".jpg"); // save
	}).catch(function (err) {
	    console.error(err);
	});
}

router.post('/', function(req, res, next) {

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

    request.post({ url: 'https://api-us.faceplusplus.com/facepp/v3/detect', formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        res.send(body);

				var faces = JSON.parse(body).faces;

				for (var i = 0; i < faces.length; i++) {
					var options = {
						x: faces[i].face_rectangle.left,
						y: faces[i].face_rectangle.top,
						w: faces[i].face_rectangle.width,
						h: faces[i].face_rectangle.height,
						i: i
					};
					cropImage(req.file.path, options);
				}
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
