var express = require('express');
const https = require('https');
var mysql = require('mysql');
const fs = require('fs');

//var db = require('../service/database');
let mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));

var router = express.Router();

router.post('/login', function(req, res, next) {
  console.log('at /service/login');
  var token = req.body.token;
  checkDatabase(function (result) {
    console.log(result);

    https.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + token, (resp) => {
      resp.on('data', (data) => {
        data = JSON.parse(data);

        saveUserData(data,function (uid) {
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

router.post('/getGamerState', function (req,res, next) {
  console.log('at /service/getGamerState');
  const uid = req.session.uid;

  let result = getGamerData(uid);

});


// receive game action message from front end
router.post('/gameAction', function (req,res, next) {
  console.log('at /service/gameAction');
  const uid = req.session.uid;
//  let onset = req.session.onset;
//  const event = req.body.event;
//  const lon = req.body.param.lon;
//  const lat = req.body.param.lat;
//  const climate = req.body.param.climate;

  onset = Date.now();
  setTimeout(5000);

  let event = 'buy_land';
  const dt = Math.floor((Date.now() - onset)/5000.); // in month
  const start = 201401;
  let date = start + Math.floor(dt/12.)*100 + Math.ceil(dx/12);
//  date = date.toString();

  let lon = 1200;
  let lat = 230;
  let climate = 1;

//  let rows = getNowTempMoist(lon,lat,date);
  rows = {temp:25,moist:100};
  let temp = rows.temp;
  let moist = rows.moist;
  let pro = 100;
  let fer = 0;
  let dtemp = 0;

  let sql_buy_land = "INSERT INTO VALUES (NULL,"+(lon) +", "+ (lat) +", "+(climate)+", 0, "+(moist)+", "+(pro)+", "+(fer)+
                                          ", 0, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()";

  let connection = mysql.createConnection(mysql_config);

  if (event == 'buyLand') {

    // insert land deal
    connection.query(sql_buy_land, (err,rows) => {
      if (err) throw  err;

    });
    // cast currency



    sql_buy_land = 'INSERT '



  } else if (event =='plant') {

  } else if (event == 'irrigate') {

  }

  res.json({
    currency:'0',
    carboin:'0',



  });

});



module.exports = {
  router : router,
  checkDatabase : checkDatabase,
  saveUserData : saveUserData,
  getGamerData : getGamerData,

};
// database io




function getGamerData(uid,callback) {
  let sql_get_user_data = "SELECT * FROM users WHERE id = '"+uid+"'";
  let sql_get_user_table = "SELECT * FROM lands_" + uid;
  let userData;
  let connection = mysql.createConnection(mysql_config);

  connection.query(sql_get_user_data, function(err, rows, fields) {
    if (err) throw err;
    userData = JSON.stringify(rows[0]);
    userData = JSON.parse(userData);
    connection.query(sql_get_user_table, function (err,rows,fields) {
      let landData = JSON.stringify(rows);
      landData = JSON.parse(landData);
      connection.end();
      callback(userData,landData);
    });
  });
}

function checkDatabase(callback) {

  var connection = mysql.createConnection(mysql_config);
  let sql_check_users_table = 'show tables';

  connection.query(sql_check_users_table, function (err, rows) {
    if (err) throw err;
    if (rows.length > 0) {
      connection.end();
      callback('existed');
    } else {
      console.log('now need to create users table');
      connection.query(sql_create_users_table, function (err, rows) {
        if (err) throw err;
        connection.end();
        callback('new created');
      });
    }
  });
}

function saveUserData(userData,callback) {
  console.log('at saveUserData');

  const userid = userData['sub'];
  const email = userData['email'];
  const picture = userData['picture'];
  const given_name = userData['given_name'];
  const family_name = userData['family_name'];
  const locale = userData['locale'];

  let sql_get_user = "SELECT id FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";

  // Update user data if already exists
  let sql_update_user = "UPDATE users SET first_name = '" + given_name + "', last_name = '" + family_name + "', email = '" +
      email + "', locale = '" + locale + "', picture = '" + picture +
      "', modified = NOW() WHERE oauth_provider = 'google' AND oauth_uid = '" + userid + "';";

  let sql_create_user = "INSERT INTO users VALUES (NULL, 'google', '" + userid + "', '" + given_name + "', '" +
      family_name + "', '" + email + "', '" + locale + "', '" + picture + "', '" + given_name + "', 10000, 0, 0, 10000, 0, 0, NOW()," +
      " NOW(), NOW());";

  let sql_check_just_created = "SELECT id FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";

  let if_existed = true;
  let uid;
  let sql_check_land_table;
  var connection = mysql.createConnection(mysql_config);

  // check user if existed
  connection.query(sql_get_user, function (err, rows) {
    console.log('test0001',rows);
    let num_rows = rows.length;
//            console.log(JSON.stringify(num_rows));
    if (num_rows > 0) {
      let result = rows[0];
      if_existed = true;
      uid = result.id;
      console.log(uid);

      console.log(sql_update_user);
      connection.query(sql_update_user, function (err, rows) {
        // after update user
        connection.end();
        callback( uid );
      });
    } else {
      if_existed = false;
      console.log(sql_create_user);
      connection.query(sql_create_user, function (err, rows) {
        // after create user
        // check created user id
        console.log(sql_check_just_created);
        connection.query(sql_check_just_created, function (err, rows) {
          let result = rows[0];
          uid = result.id;
          sql_check_land_table = "SHOW TABLES LIKE 'land_"+ uid +"';";
          console.log(sql_check_land_table);
          connection.query(sql_check_land_table, function (err, rows) {
            console.log(rows);
            if (rows.length > 0) {
              console.log('error during create user table.');
            } else {
              sql_create_user_land = "CREATE TABLE lands_" + uid + sql_create_user_land;
              connection.query(sql_create_user_land, function (err, rows) {
                connection.end();
                callback( uid );
              });
            }
          });
        });
      });
    }
  });
}

let sql_create_users_table = "CREATE TABLE users (" +
    "         id int(11) NOT NULL AUTO_INCREMENT," +
    "         oauth_provider varchar(10) COLLATE utf8_unicode_ci NOT NULL," +
    "         oauth_uid varchar(50) COLLATE utf8_unicode_ci NOT NULL," +
    "         first_name varchar(25) COLLATE utf8_unicode_ci NOT NULL," +
    "         last_name varchar(25) COLLATE utf8_unicode_ci NOT NULL," +
    "         email varchar(50) COLLATE utf8_unicode_ci NOT NULL," +
    "         locale varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL," +
    "         picture varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL," +
    "         username varchar(25) COLLATE utf8_unicode_ci NOT NULL," +
    "         currency INT NOT NULL," +
    "         carboin INT NOT NULL," +
    "         now_rank INT NOT NULL," +
    "         max_currency INT NOT NULL," +
    "         max_carboin INT NOT NULL," +
    "         max_rank INT NOT NULL," +
    "         achieved datetime NOT NULL," +
    "         created datetime NOT NULL," +
    "         modified datetime NOT NULL," +
    "         PRIMARY KEY (id)" +
    "        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

let sql_create_user_land = " (" +
    "         id int(11) NOT NULL AUTO_INCREMENT," +
    // land
    "         lon SMALLINT NOT NULL," + // -1800 - 1800 (lon*10)
    "         lat SMALLINT NOT NULL," + // -1800 - 1800 (lat*10)
    "         climate TINYINT NOT NULL," + // 0 - 127
    "         valid TINYINT NOT NULL," + // 0 or 1
    "         temperature SMALLINT NOT NULL," + //
    "         moisture TINYINT NOT NULL," + // 0-100 (-128 - 127)
    "         productivity TINYINT NOT NULL," + // 0-100 (-128 - 127)
    "         fertilization TINYINT NOT NULL," + // 0, 20, 40 (-128 - 127)
    "         delta_temp TINYINT NOT NULL," + // -20 - 40 (d_temp*10)
    // product
    "         type TINYINT NOT NULL," + // plant type#  0-
    "         plant_time datetime NOT NULL," + // 0-100 (-128 - 127)
    "         completeness TINYINT NOT NULL," + // 0-100 (-128 - 127)
//    "         healthiness TINYINT NOT NULL," + // 0-100 (-128 - 127)
    "         prod_rate FLOAT NOT NULL," +
    "         product TINYINT NOT NULL," + // 0-100
    "         created datetime NOT NULL," +
    "         modified datetime NOT NULL," + //
    "         PRIMARY KEY (id)" +
    "        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";