var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('at /');

    // 顯示 index.ejs
    res.render('index.ejs');

});

router.post('/tokensignin', function(req, res, next) {
  console.log('at /tokensignin');

  res.render('tokensignin.ejs',{
    title : 'tokensignin'
  })


});

module.exports = router;

