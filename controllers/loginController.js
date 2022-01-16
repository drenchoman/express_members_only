const passport = require('passport')

exports.login_get = function(req, res, next){
  if (res.locals.currentUser){
    res.redirect('/member')
  }
  res.render('login', {message: req.flash('error')})
};

exports.loginUser_post = passport.authenticate('local', {
    successRedirect: '/member',
    failureRedirect: '/login',
    failureFlash: true
  });
