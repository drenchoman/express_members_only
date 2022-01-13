const bcrypt = require('bcryptjs');
const User = require('../models/users')
const passport = require('passport')
const { body, validationResult } = require('express-validator')

exports.index = function(req, res, next){
    res.render('index', {user: req.user, })

};

exports.confirmMembership_post = [
  body('passcode').trim().isLength({max: 4}).escape().custom(async(value,{ req }) => {
    if( value !== '1337'){
      throw new Error('Passcode is incorrect')
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.render('/index', {passcodeError: 'Passcode is incorrect'});
    }
        const userToUpdate = await User.findOne({username: res.locals.currentUser.username});
        userToUpdate.member = true;
        await userToUpdate.save( err => {
          if (err) {
            return next(err);
          }
          console.log('User updated to offical member');
          res.redirect('/');
        });
      }
];

exports.login_get = function(req, res, next){
  res.render('login', {message: req.flash('error')})
};

exports.register_get = function(req, res, next){
  res.render('register', {title: 'Register',})
};

exports.loginUser_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  });


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
        console.log('Errors', errors.errors[0])
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

            }).save(err => {
              if (err){
                return next(err);
              }
              // New User created was successful
              console.log('user created')
              res.redirect('/')
            });
          })
        } catch(err){
          return next(err);
        }
        }
      ];
