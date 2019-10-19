var express = require('express');
const https = require('https');
var db = require('../service/database');
const fs = require('fs');


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

router.get('/conclude', function(req, res, next) {
  console.log('at /service/conclude');

  if (req.session.isLogin >= 0) {
    let uid = req.session.uid;
    let gid = req.session.gid;
    if (req.session.concluded < 1) {
      db.concludeUserProperty(uid, gid, function (err) {
        req.session.concluded = 1;
      });
    }
    db.updateUserHistory(uid, function (err) {
      console.log('user history updated ...');
      res.redirect('/finish'); // at index.js
    })

  } else {
    console.log('need to login');
    res.redirect('/');
  }
});




router.post('/login_guest', function(req, res, next) {
  console.log('at /service/login_guest');
  let uid;
  if (req.session.isLogin == 0) {
    uid = req.session.uid_guest
  } else {
    uid = null;
  }
  let data = {uid: uid,username: req.body.username};

  db.saveUserData( data, function (err, uid,) {
    console.log('uid: ', uid);
    req.session.uid = uid;
    req.session.uid_guest = uid;
    req.session.name = data.username;
    req.session.isLogin = 1;
    console.log('Save uid & name to session');

    res.redirect('/game'); // at index.js
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
  const lon = parseFloat(req.body.lon) * 1000;
  const lat = parseFloat(req.body.lat) * 1000;

//  console.log(lon,lat);

  let p_type = data.p_type;

  switch (event) {
    case "user_get_rank":
      db.get_userRank(uid, function (err,rank) {
        res.send({
          err: err,
          rank: rank,
        });
      });
      break;

    case "user_if_gameStart":
      db.if_gameStart(uid, function (err,status,new_gid,currency,carboin,remain_time) {
        req.session.gid = new_gid;
        res.send({
          err: err,
          status: status,
          gid: new_gid,
          currency: currency,
          carboin: carboin,
          remain_time: remain_time,
        });
      });
      break;
    case "user_evt_gameStart":
      db.evt_gameStart(uid, function (err,new_gid,currency,carboin) {
        req.session.gid = new_gid;
        if (err) {
        } else {
          req.session.concluded = 0;
        }
        res.send({
          err: err,
          gid: new_gid,
          currency: currency,
          carboin: carboin,
        });
      });
      break;
    case "user_evt_buyLand":
      console.log('user_evt_buyLand now')
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
      db.evt_harvest(uid,gid,lon,lat, function (err,currency,earn,carboin,cb_chg) {
        res.send({
          currency: currency,
          earn: earn,
          carboin: carboin,
          cb_chg: cb_chg,
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


router.post('/get_poly', function(req, res, next) {
  console.log('at /service/get_poly');
  let lon = req.body.lon;
  let lat = req.body.lat;
//  console.log(lon,lat);

  getPoints(lon,lat,function (err,points) {
    if (err) {
      res.send([{err:err}])
    } else {
      console.log(points);
      res.send([{err:err},points])
    }
  });
});

land_file = fs.readFileSync('data/climate_red.dat','utf-8');

let land_points = land_file.split('\n').map(function(line, index) {
  return (line.split(' '));
});

function getPoints(lon,lat,callback) {

  const near_lon = Math.floor(lon/0.25)*0.25 + 0.125;
  const near_lat = Math.floor(lat/0.25)*0.25 + 0.125;
  let points = [];
  for (let i=-2;i<3;i++) {
    for (let j = -2; j < 3; j++) {
      if (i^2+i^2 <= 3.5) {
        let tmp_lon = near_lon+i*0.25;
        let tmp_lat = near_lat+j*0.25;
        land_points.forEach(function (land) {
          if ((tmp_lon) == land[0] &&  (tmp_lat) == land[1]) {
            points.push({lon:tmp_lon,lat:tmp_lat,clm:land[2]});
          }
        })
      }
    }
  }
  if (points.length > 0) {
    callback(null, points)
  } else {
    callback(1)
  }
}

function inside(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  var x = point[0], y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];

    var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};


module.exports = router;
// database io

