var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    faceTokenArray: [String],
    imgArray: [{
   		data: Buffer, contentType: String
   	}],
    name: String
});

module.exports = mongoose.model('User', UserSchema);
