var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('at /');
    if(req.session.isLogin) {
        const uid = req.session.uid;
        console.log('uid is: ' + uid);
    }
    // 顯示 index.ejs
    res.render('index.ejs');
});

router.get('/login', function (req, res,next) {
    console.log('at /login');

    // is login already
    if(req.session.isLogin) {
        const uid = req.session.uid;
        console.log('uid is: ' + uid);
        console.log('redirect to /users');
        res.redirect('/users');

    } else {
        console.log('need to login');
        res.render('login.ejs',{title : 'login page'});
    }
});


router.get('/logout', function (req, res,next) {
    console.log('at /logout');

    req.session.destroy();
    res.redirect('/');
});


router.get('/about', function(req, res, next) {
  console.log('at /about');

  res.render('about.ejs',{
    title : 'about'
  })

});

router.get('/introduce', function(req, res, next) {
  console.log('at /introduce');

  res.render('introduce.ejs',{
    title : 'introduce'
  })

});

router.get('/game_start', function(req, res, next) {
  console.log('at /game_start');

  res.render('game_start.ejs',{
    title : 'game_start'
  })

});

module.exports = router;

