var User = require('../models/user.js');
var fs = require('fs');

exports.add = function(req, res) {
	if(!req.body.faceToken) {
    	res.status(400).send({message: "Face can not be empty"});
    }
		console.log("faceToken", req.body.faceToken);
		var image = {
			data : fs.readFileSync('./crop/0.jpg'),
			contentType: 'image/jpeg'
		};
    var user = new User({faceTokenArray: [req.body.faceToken], imgArray: [image], name: 'Anatoly'});
    user.save(function(err, data) {
        console.log(data);
        if(err) {
            console.log(err);
            res.status(500).send({message: "Some error occurred while creating the Note."});
        } else {
            res.send(data);
        }
    });
};
