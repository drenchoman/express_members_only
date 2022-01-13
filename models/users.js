var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true, maxLength: 20},
  password: {type: String, required: true },
  admin: {type: Boolean, default: false},
  member: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', UserSchema);
