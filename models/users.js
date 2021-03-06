var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true, maxLength: 20},
  password: {type: String, required: true },
  admin: {type: Boolean, default: false},
  member: {type: Boolean, default: false},
  messages:[{type: Schema.Types.ObjectId, ref: 'Message'}],
  avatar: {type: String,
    enum: ['cube1', 'cube2', 'cube3', 'cube4', 'cube5', 'smiley1', 'smiley2', 'smiley3', 'smiley4', 'cookie', 'pizza', 'king'],
    default: 'cube1'}
});

UserSchema
  .virtual('getImageURL')
  .get(function () {
    const url = '/images/' + this.avatar + '.svg'
    return url
  });

UserSchema
  .virtual('getProfileUrl')
  .get(function () {
    const url = '/members/' + this._id
    return url
  });

module.exports = mongoose.model('User', UserSchema);
