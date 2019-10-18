var express = require('express');
const https = require('https');
var db = require('../service/database');

var router = express.Router();

router.post('/login', function(req, res, next) {
  console.log('at /service/login');
  var token = req.body.token;
  https.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + token, (resp) => {
    resp.on('data', (data) => {
      data = JSON.parse(data);

      db.saveUserData(data,function (err,uid,gid) {
        console.log('uid: ',uid);
        name = data.name;
        req.session.uid = uid;
        req.session.gid = gid;
        req.session.name = name;
        req.session.isLogin  = 1;
        console.log('Save uid & name to session');

        res.redirect('/game'); // at index.js
      });

    });
  });
});

// receive game action message from front end
router.post('/gameAction', function (req,res, next) {
  console.log('at /service/gameAction');
  const uid = req.session.uid;
  const gid = req.session.gid;
  let err = 0;
//  let onset = req.session.onset;
//  const event = req.body.event;
//  const climate = req.body.param.climate;

  onset = Date.now();

  const dt = Math.floor((Date.now() - onset)/5000.); // in month
  const start = 201401;

  let date = start + Math.floor(dt/12.)*100 + Math.ceil(dt/12);
//  date = date.toString();
//  console.log(date);

  rows = {temp:25,moist:100};

  let data = JSON.parse(JSON.stringify(req.body));
  let event = data.event;
  const lon = parseFloat(req.body.lon) * 10;
  const lat = parseFloat(req.body.lat) * 10;

//  console.log(lon,lat);

  let p_type = data.p_type;

  switch (event) {
    case "user_evt_gameStart":
      db.evt_gameStart(uid, function (err,new_gid,currency,carboin) {
        req.session.gid = new_gid;
        res.send({
          err: err,
          gid: new_gid,
          currency: currency,
          carboin: carboin,
        });
      });
      break;
    case "user_evt_buyLand":
      db.evt_buy_land(uid,gid,lon,lat, function (err,currency) {
        res.send({
          currency: currency,
          carboin: '0',
          err: err
        });
      });
      break;
    case "user_evt_plant":
      db.evt_plant(uid,gid,lon,lat,p_type, function (err,currency) {
        res.send({
          currency: currency,
          carboin: '0',
          err: err
        });
      });
      break;
    case "user_evt_harvest":
      db.evt_harvest(uid,gid,lon,lat, function (err,currency,earn) {
        res.send({
          currency: currency,
          earn: earn,
          carboin: '0',
          err: err
        });
      });
      break;
    case "user_evt_irrigate":
      db.evt_add_on(uid,gid,lon,lat,event, function (err,currency,earn) {
        res.send({
          currency: currency,
          carboin: '0',
          err: err
        });
      });
      break;
    case "user_evt_fertilize":
      db.evt_add_on(uid,gid,lon,lat,event, function (err,currency,earn) {
        res.send({
          currency: currency,
          carboin: '0',
          err: err
        });
      });
      break;
    case "user_evt_debug":
      db.evt_add_on(uid,gid,lon,lat,event, function (err,currency,earn) {
        res.send({
          currency: currency,
          carboin: '0',
          err: err
        });
      });
      break;
    case "user_evt_greenhouse":
      db.evt_add_on(uid,gid,lon,lat,event, function (err,currency,earn) {
        res.send({
          currency: currency,
          carboin: '0',
          err: err
        });
      });
      break;
    case "get_user_status":
      db.getUserStatus(uid, function (rows) {
        res.send(rows);
      });
      break;
    case "get_user_assets":
      db.getUserLands(uid,gid, function (rows) {
        res.send(rows);
      });
  }
});


module.exports = router;
// database io

