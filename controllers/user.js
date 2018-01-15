var request = require('request');
var User = require('../models/user.js');

exports.add = function(req, res) {
    console.log(req.body);
	if(!req.body.face_tokens) {
    	res.status(400).send({message: "Face can not be empty"});
    }

    var faceTokenArray = req.body.face_tokens.split(",");
    var user = new User({faceTokenArray: faceTokenArray, imgArray: [req.body.image_base64], name: req.body.username});
    user.save(function(err, data) {
        // console.log(data);
        if(err) {
            console.log(err);
            res.status(500).send({message: "Some error occurred while creating the Note."});
        } else {
            console.log(data);
            console.log("Data saved sucsess");
        }
    });

    var formData = {
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        outer_id: 'user',
        face_tokens: req.body.face_tokens
    };

    request.post({ url: 'https://api-us.faceplusplus.com/facepp/v3/faceset/addface', formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        res.send(body);
    });
};
