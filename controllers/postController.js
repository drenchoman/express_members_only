const bcrypt = require('bcryptjs');
const User = require('../models/users')
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const Message = require('../models/messages')

exports.index = async(req, res, next) => {
  try{
    const messages = await Message.find().sort([['timeStamp', 'descending']]).populate('user');

    res.render('index', {user: req.user, messages: messages,});
  }
    catch(err){
      return next(err);
    }

};

exports.confirmMembership_post = [
  body('passcode').trim().isLength({max: 4}).escape().custom(async(value,{ req }) => {
    if( value !== '2169'){
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


exports.login_get = function(req, res, next){
  if (res.locals.currentUser){
    res.redirect('/member')
  }
  res.render('login', {message: req.flash('error')})
};

exports.register_get = function(req, res, next){
  const images =
  res.render('register', {title: 'Register',})
};

exports.memberpage_get = async function(req, res, next){
  try{
    const messages = await Message.find().sort([['timeStamp', 'descending']]).populate('user');
    res.render('member', {user: req.user, errorMessage: req.flash('error',), messages: messages})
  } catch(err){
    return next(err);
  }
};

exports.loginUser_post = passport.authenticate('local', {
    successRedirect: '/member',
    failureRedirect: '/login',
    failureFlash: true
  });

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
]


exports.createUser_post = [

    // validation
    body('username').trim().isLength({min: 2}).escape().withMessage('Username must be at least 2 characters long.'),
    body('password').trim().isLength({min: 5}).escape().withMessage('Password must be at least 5 characters long'),
    body('confirmPassword').trim().isLength({min: 5}).escape().withMessage('Password must be at least 5 characters long')
    .custom( async(value, {req }) => {
      if(value !== req.body.password){
          throw new Error('Password confirmation does not match password')
      }
      return true;

    }),
     async (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()){
        return res.render('register', {title: 'Register', errors: errors.errors, username: req.body.username})
      }
      try {
        const userExists = await User.findOne({username: req.body.username});
        if(userExists !== null){
          console.log('User exists')
           return res.render('register', {title: 'Register', usernameExists: 'Username already exists'})
        }
          bcrypt.hash(req.body.password, 12, (err, hashedPassword) =>{
            const user = new User({
              username: req.body.username,
              password: hashedPassword,
              admin: false,
              member: false,
              avatar: req.body.avatar

            })
            user.save(err => {
              if (err){
                return next(err);
              }

              // New User created was successful
              console.log('user created')

              res.redirect('/login')

            })


        })
      }  catch(err){
          return next(err);
        }
        }
      ];
