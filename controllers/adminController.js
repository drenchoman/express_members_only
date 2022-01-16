const User = require('../models/users')
const { body, validationResult } = require('express-validator')
const Message = require('../models/messages')


exports.admin_get = (req, res, next) => {
    res.render('admin', {title:'Admin log in', user: res.locals.currentUser});
};

exports.makeAdmin_post = [
  body('password').trim().isLength({max: 4}).escape().custom(async(value,{req}) => {
    if (value !== process.env.DB_ADMIN_PASSCODE){
      throw new Error('Password is incorrect')
    }
    return true;
  }),

  async(req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.render('admin', {title:'Admin log in', admin: req.user.admin, message: 'Password is incorrect'});
    }
    const userToUpdate = await User.findOne({username: res.locals.currentUser.username});
    userToUpdate.admin = true;
    await userToUpdate.save( err => {
      if (err){
        return next(err);
      }
      console.log('User updated to admin');
      res.redirect('/member');
    })
  }
]

exports.delete_post = function(req, res, next){
    const id= req.body.messageId
    Message.findByIdAndDelete(id, function(err, docs){
      if (err){
        return next(err);
      }
      console.log('Deleted : ', docs)
      res.redirect('/member')
    })
  }
