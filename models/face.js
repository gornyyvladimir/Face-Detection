var mongoose = require('mongoose');

var FaceSchema = mongoose.Schema({
    faceToken: String
    // image: Buffer
});

module.exports = mongoose.model('Face', FaceSchema);