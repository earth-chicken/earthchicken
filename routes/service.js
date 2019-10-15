var express = require('express');
const https = require('https');
var db = require('../service/database');

var router = express.Router();

router.post('/login', function(req, res, next) {
  console.log('at /service/login');
  var token = req.body.token;
  db.checkDatabase(function (result) {
    console.log(result);

    https.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + token, (resp) => {
      resp.on('data', (data) => {
        data = JSON.parse(data);

        db.saveUserData(data,function (uid) {
          console.log('uid: ',uid);
          name = data.name;
          req.session.uid = uid;
          req.session.name = name;
          req.session.isLogin  = 1;
          console.log('Save uid & name to session');

          res.redirect('/game'); // at index.js
        });

      });
    });
  });
});


// receive game action message from front end
router.post('/gameAction', function (req,res, next) {
  console.log('at /service/gameAction');
  const uid = req.session.uid;
  let err = 0;
//  let onset = req.session.onset;
//  const event = req.body.event;
//  const lon = req.body.param.lon;
//  const lat = req.body.param.lat;
//  const climate = req.body.param.climate;

  onset = Date.now();
//  setTimeout(5000);

  const dt = Math.floor((Date.now() - onset)/5000.); // in month
  const start = 201401;

  let date = start + Math.floor(dt/12.)*100 + Math.ceil(dt/12);
//  date = date.toString();
  console.log(date);

  let climate = 1;

//  let rows = getNowTempMoist(lon,lat,date);
  rows = {temp:25,moist:100};
  let temp = rows.temp;
  let moist = rows.moist;
  let pro = 100;
  let fer = 0;

  let cast = 1000;

  let data = JSON.parse(JSON.stringify(req.body));
  let event = data.event;

  console.log(typeof event,typeof 'buy_land');
  if (event == 'buy_land') {
    const lon = req.body.lon;
    const lat = req.body.lat;

    console.log(lon,lat);
    let param = [uid, lon, lat, climate, temp, moist, pro, fer];
    db.addLand(param, function (rows1) {
      console.log('land added');
      console.log(rows1);
      let param = [uid, cast];
      db.castMoney(param, function (rows2) {
        console.log(rows2);
        res.send([
          rows2,
          {carboin: '0'},
          {err: '0'}]
        )
      })
    });
  } else if (event =='get_user_status') {
    db.getUserStatus(uid, function (rows) {
      res.send(rows);
    });
  } else if (event =='get_user_assets') {
    db.getUserLands(uid, function (rows) {
      res.send(rows);
    });
  } else if (event == 'irrigate') {

  }

});

module.exports = router;
// database io
