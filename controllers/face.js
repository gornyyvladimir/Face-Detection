var Face = require('../models/face.js');

exports.add = function(req, res) {
	console.log(req);
	if(!req.body.faceToken) {
    	res.status(400).send({message: "Face can not be empty"});
    }

    var face = new Face({faceToken: req.body.faceToken});
    face.save(function(err, data) {
        console.log(data);
        if(err) {
            console.log(err);
            res.status(500).send({message: "Some error occurred while creating the Note."});
        } else {
            res.send(data);
        }
    });
};