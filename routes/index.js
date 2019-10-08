var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('at /');

    // 顯示 index.ejs
    res.render('index.ejs');

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

