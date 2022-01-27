const User = require('../models/users')
const { body, validationResult } = require('express-validator')
const Message = require('../models/messages');
const Reply = require('../models/replies');

exports.memberpage_get = async function(req, res, next){
  try{
    const messages = await Message.find().sort([['timeStamp', 'descending']])
    .populate([{
      path: 'user',
      model: 'User'
    }, {
      path: 'replies',
      model: 'Replies',
      populate: {
        path: 'user',
        model: 'User'
      }
    }]);

    res.render('member', {user: req.user, errorMessage: req.flash('error',), messages: messages, })
  } catch(err){
    return next(err);
  }
};

exports.allMembers_get = async function(req, res, next){
  try{
    const members = await User.find();
    res.render('allmembers', {members: members, user: res.locals.currentUser})
  } catch(err){
    return next(err);
  }
}

exports.userProfile_get = async function(req, res, next){
  try{
    const profile = await User.findOne({_id: req.params.id}).populate('messages')
    res.render('memberprofile', {avatar: profile.getImageURL, name:profile.username, messages: profile.messages, profid: profile._id, user:res.locals.currentUser})
  } catch(err){
    return next(err)
  }
}

exports.confirmMembership_post = [
  body('passcode').trim().isLength({max: 4}).escape().custom(async(value,{ req }) => {
    if( value !== process.env.DB_MEMBER_PASSCODE){
      throw new Error('Passcode is incorrect')
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.render('member', {user:req.user, passcodeError: 'Passcode is incorrect'});
    }
        const userToUpdate = await User.findOne({username: res.locals.currentUser.username});
        userToUpdate.member = true;
        await userToUpdate.save( err => {
          if (err) {
            return next(err);
          }
          console.log('User updated to offical member');
          res.redirect('/member');
        });
      }
];

exports.addMessage_post = [
  body('title').trim().isLength({min:1}).withMessage('Add a title to your post'),
  body('message').trim().isLength({min:1}).withMessage('Add a message!'),

  async (req ,res, next) => {
    const errors = validationResult(req)
  if(!errors.isEmpty()){
    console.log('error', errors)
    return next(err);
}
  try{
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user:res.locals.currentUser
    })
    message.save(err =>{
      if (err){
        return next(err);
      }
      console.log('message saved');
      res.redirect('/member');
    })
    await User.findOneAndUpdate(
      {_id: message.user._id},
      {$push: {messages: message}}
    )

  } catch(err){
    return next(err);
  }

  }
];

exports.addReply_post = [
  body('reply').trim().isLength({min:1}).withMessage('Add a message'),

  async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      console.log('error', errors);
      return next(err);
    }
    try{
      const reply = new Reply({
        messageReply: req.body.reply,
        user: res.locals.currentUser,
        messageId: req.body.postId
      })
      reply.save(err => {
        if (err){
          return next(err)
        }
        console.log('reply saved');

        })
        await Message.findOneAndUpdate(
          {_id: reply.messageId},
          {$push: {replies: reply}
        });
          console.log('Message with replies updated')
          res.redirect('/member')

    } catch(err){
      return next(err)
    }
  }

];
