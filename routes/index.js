var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // 顯示 index.ejs 且改變ejs內 % % 處變數為指定值
  res.render('index', { title: 'Earth Chicken' });
});

module.exports = router;
