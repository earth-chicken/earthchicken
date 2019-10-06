var express = require('express');
var db = require('../service/database');

var router = express.Router();

router.post('/', function(req, res, next) {
  console.log('at /server');

  var token = req.body.idtoken;
  var CLIENT_ID = '795354931669-g57mp7k3fb52u9vk1mscp78unk19sied.apps.googleusercontent.com';

  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    db.saveUserData(payload);
  }
  verify().catch(console.error);

  // 接收到post之後需要回覆結束
  res.end('It worked!');
  /*
  next(function() {
    console.log('redirction');
//    res.redirect("/user/"+given_name+"/dashboard");
  });
  */


});


module.exports = router;

