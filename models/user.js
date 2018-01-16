var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    faceToken: String,
    image: String,
    name: String
});

module.exports = mongoose.model('User', UserSchema);
