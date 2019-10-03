var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-05.cleardb.net',
  user     : 'ba8df658a414c9',
  password : 'c5eabe84',
  database : 'heroku_67e77e10602a053'
});

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
    saveUserData(payload);

//    console.log(userid,email,given_name,family_name,locale);
  }
  verify().catch(console.error);

});




// Save user data to the database
function saveUserData(userData){

  const userid = userData['sub'];
  const email = userData['email'];
  const picture = userData['const'];
  const given_name = userData['given_name'];
  const family_name = userData['family_name'];
  const locale = userData['locale'];

  //開始連接
  console.log("Connected to Mysql");
  connection.connect();

  /*
  var sql = "DROP TABLE users";
  connection.query(sql, function(err, result, fields) {
    if (err) throw err;
  });
  */

  var sql = "SHOW tables";
  connection.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log(result);
  });


  var sql = "CREATE TABLE users (" +
      "         id int(11) NOT NULL AUTO_INCREMENT," +
      "         oauth_provider varchar(10) COLLATE utf8_unicode_ci NOT NULL," +
      "         oauth_uid varchar(50) COLLATE utf8_unicode_ci NOT NULL," +
      "         first_name varchar(25) COLLATE utf8_unicode_ci NOT NULL," +
      "         last_name varchar(25) COLLATE utf8_unicode_ci NOT NULL," +
      "         email varchar(50) COLLATE utf8_unicode_ci NOT NULL," +
      "         gender varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL," +
      "         locale varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL," +
      "         picture varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL," +
      "         link varchar(255) COLLATE utf8_unicode_ci NOT NULL," +
      "         created datetime NOT NULL," +
      "         modified datetime NOT NULL," +
      "         PRIMARY KEY (id)" +
      "        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";

  /*
  connection.query(sql, function(error,result){
    console.log('test',result);
    if(error){
      console.log('Table create fail!');
      //throw error;
    } else {
      console.log('Creating table ...');
    }
  });
  */

  var num_rows = 0;

  sql = "SELECT * FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";
  connection.query(sql, function(err, result, fields){
    if (err) throw err;
    num_rows = result.length;
    console.log(num_rows);

    if(num_rows = 0) {
      sql = "INSERT INTO users VALUES (NULL, 'google', '" + userid + "', '"+ given_name +"', '"+
          family_name +"', '"+ email +"', ' ', '" + locale + "', '"+picture+"', ' ', NOW(), NOW())";
      connection.query(sql, function(err, result, fields) {
        if (err) throw err;
        console.log('user '+given_name+' adding ...');
      })

    } else if (num_rows > 0) {
      // Update user data if already exists
      sql = "UPDATE users SET first_name = '" + given_name + "', last_name = '" + family_name + "', email = '" +
          email + "', gender = ' ', locale = '" + locale + "', picture = '" + picture +
          "', link = ' ', modified = NOW() WHERE oauth_provider = 'google' AND oauth_uid = '" + userid + "'";
      connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log('user ' + given_name + ' existed ...');
      })

    } else if (num_rows > 1) {
      console.log('database error ...');
    }
  });

  connection.end();
}

module.exports = router;

