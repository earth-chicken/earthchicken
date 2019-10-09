var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  console.log('at /users');

//  console.log(req.session.isLogin);
  if(req.session.isLogin) {

    uid = req.session.uid;
    name = req.session.name;
    console.log('uid is: ' + uid);

    res.render('dashboard', { title: name} );

  } else {
    console.log('need to login');
    res.redirect('/');
  }

});


router.get('/map', function(req, res, next) {
  const username = req.params.username;

  res.send(username + 'at user map');
});

module.exports = router;
