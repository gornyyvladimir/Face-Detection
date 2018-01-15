var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    faceTokenArray: [String],
    imgArray: [String],
    name: String
});

module.exports = mongoose.model('User', UserSchema);
