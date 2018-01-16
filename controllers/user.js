var request = require('request');
var User = require('../models/user.js');

exports.add = function(req, res, next) {
    // console.log(req.body);
    if(!req.body.face_tokens) {
        // return res.status(400).send({message: "Face can not be empty"});
        var notFound = new Error('face_token can not be empty');
        notFound.status = 400;
        return next(notFound);
    }

    var formData = {
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        outer_id: 'users',
        face_tokens: req.body.face_tokens
    };

    request.post({ url: 'https://api-us.faceplusplus.com/facepp/v3/faceset/addface', formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return next(err);
        }
        // res.send(body);

        var faceToken = req.body.face_tokens.split(",")[0];
        var user = new User({faceToken: faceToken, image: req.body.image_base64, name: req.body.username});
        user.save(function(err, data) {
            // console.log(data);
            if(err) {
                // console.log(err);
                // res.status(500).send({message: "Some error occurred while creating the User."});
                var error = new Error("Some error occurred while creating the User")
                error.status = 500;
                return next(err);

            } else {
                var result = {
                    api: JSON.parse(body),
                    database: data
                };
                res.json(result);
            }
        });
    });
};

exports.search = function(req, res, next) {
    var faceToken = req.body.face_tokens;
    if(!faceToken) {
        var notFound = new Error('face_token can not be empty');
        notFound.status = 400;
        return next(notFound);
    }

    var formData = {
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        outer_id: 'users',
        face_token: faceToken
    };

    request.post({ url: 'https://api-us.faceplusplus.com/facepp/v3/search', formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return next(err);
        }

        var result = JSON.parse(body).results[0];
        if(!result) {
            return res.json({error: "no results"})
        }
        User.findOne({faceToken: result.face_token},function(err, user){
            if(err) {
                return next(err);
            }
            if(!user){
                res.json({error: "no user"})
            }
            else{
                res.json(user);
            }
        });
    });

};


