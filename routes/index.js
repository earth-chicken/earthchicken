var express = require('express');
var db = require('../service/database');

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

router.get('/map', function(req, res, next) {
  console.log('at /about');

  res.render('map.ejs',{
    title : 'map'
  })

});


router.get('/introduce', function(req, res, next) {
  console.log('at /introduce');

  res.render('introduce.ejs',{
    title : 'introduce'
  })

});

router.get('/game', function(req, res, next) {
    console.log('at /game');

    if(req.session.isLogin) {
        const uid = req.session.uid;
        let username = req.session.name;

        res.render('game.ejs', {
            name: username,
            lands: '123'
        });
    } else {
        console.log('need to login');
        res.redirect('/');
    }
});

router.post('/farm', function(req, res, next) {
    console.log('at /farm');

    if(req.session.isLogin) {
        const uid = req.session.uid;
        let username = req.session.name;

        let lon = req.body.lon;
        let lat = req.body.lat;
        let clm = req.body.clm;
        let currency;
        let carboin;
        db.getUserStatus(uid, function (userData) {
            currency = userData.currency;
            carboin = userData.carboin;

            res.render('farm.ejs', {
                name: username,
                currency: currency,
                carboin: carboin,
                lon: lon,
                lat: lat,
                clm: clm,
            });
        });

    } else {
        console.log('need to login');
        res.redirect('/');
    }
});




router.get('/finish', function(req, res, next) {
    console.log('at /finish');

    if(req.session.isLogin) {
        const uid = req.session.uid;
        let username = req.session.name;

        // todo update user historic record


        res.render('finish.ejs');
    } else {
        console.log('need to login');
        res.redirect('/');
    }
});


module.exports = router;
