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
//  console.log(date);



//  let rows = getNowTempMoist(lon,lat,date);
  rows = {temp:25,moist:100};

  let lon = 120;
  let lat = 23;
  let data = JSON.parse(JSON.stringify(req.body));
  let event = data.event;

  let p_type = data.p_type;

  switch (event) {
    case "user_evt_buyLand":
      db.evt_buy_land(uid,lon,lat, function (err,money) {
        res.send(
            [{currency: money,
              carboin: '0',
              err: err}]
        )
      });
      break;
    case "user_evt_plant":
      db.evt_plant(uid,lon,lat,p_type, function (err,money) {
        res.send(
            {currency: money,
              carboin: '0',
              err: err}
        )
      });
      break;
    case "user_evt_harvest":
      db.evt_harvest(uid,lon,lat, function (err,money,earn) {
        res.send(
            {currency: money,
              earn: earn,
              carboin: '0',
              err: err}
        )
      });
  }



  if (event == 'evt_buy_land') {
    const lon = req.body.lon;
    const lat = req.body.lat;

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

