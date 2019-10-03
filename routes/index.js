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

module.exports = router;

