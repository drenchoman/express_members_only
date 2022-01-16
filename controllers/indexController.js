const Message = require('../models/messages')

exports.index = async(req, res, next) => {
  if(res.locals.currentUser){
    res.redirect('/member')
  }
  try{
    const messages = await Message.find().sort([['timeStamp', 'descending']]).populate('user');

    res.render('index', {user: req.user, messages: messages,});
  }
    catch(err){
      return next(err);
    }

};
