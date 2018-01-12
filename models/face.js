var mongoose = require('mongoose');

var FaceSchema = mongoose.Schema({
    faceToken: String,
    img: { 
   		data: Buffer, contentType: String 
   	}
});

module.exports = mongoose.model('Face', FaceSchema);