var express = require('express');

var router = express.Router();


router.post('/', function(req, res, next) {
  console.log('at /tokensignin');

//  console.log(req.query.id);
  console.log(req.body.idtoken);



});

module.exports = router;

