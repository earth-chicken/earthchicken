var express = require('express');
const https = require('https');

var db = require('../service/database');

var router = express.Router();

router.get('/:token', function(req, res, next) {
  console.log('at /service');
  var token = req.params.token;
  //req.session.token = token;

  https.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + token, (resp) => {

    resp.on('data', (data) => {
      data = JSON.parse(data);
      db.saveUserData(data);
      uid = data.sub;
      name = data.name;
      req.session.uid = uid;
      req.session.name = name;
      req.session.isLogin  = 1;
      console.log('Save uid & name to session');
      res.redirect('/users');
    });

  }).on('error', (e) => {
    console.error(e);
  });

});

router.get('/test', function(req, res, next) {
  console.log('at /service/test');

});

module.exports = router;

