const User = require('../models/users')
const { body, validationResult } = require('express-validator')
const Message = require('../models/messages');

exports.memberpage_get = async function(req, res, next){
  try{
    const messages = await Message.find().sort([['timeStamp', 'descending']]).populate('user');
    res.render('member', {user: req.user, errorMessage: req.flash('error',), messages: messages})
  } catch(err){
    return next(err);
  }
};

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

  } catch(err){
    return next(err);
  }

  }
];
