var mongoose = require('mongoose');
var { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var ReplySchema = new Schema({
  messageReply: {type: String, required: true, minLength: 1, maxLength: 500 },
  user: {type: Schema.Types.ObjectId, ref: 'User', requried: true},
  timeStamp: {type: Date, default: Date.now, required: true},
  messageId: {type: Schema.Types.ObjectId, ref: 'Message'}
});

ReplySchema
  .virtual('getDate')
  .get(function () {
    return DateTime.fromJSDate(this.timeStamp).toFormat('dd LLL yyyy');
  });

ReplySchema
  .virtual('getTime')
  .get(function () {
    return DateTime.fromJSDate(this.timeStamp).toFormat('HH: mm')
  })

  module.exports = mongoose.model('Replies', ReplySchema);
