var express = require('express');
const https = require('https');
var mysql = require('mysql');
const fs = require('fs');

//var db = require('../service/database');

var router = express.Router();

const logAsync = (message, time) => {
  return new Promise((resolve, reject) => {
    if (message && time) {
      setTimeout(() => {
        console.log(message);
        resolve()
      }, time);
    } else {
      reject();
    }
  });
};


router.post('/', function(req, res, next) {
  console.log('at /service');
  var token = req.body.token;

  https.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + token, (resp) => {
    resp.on('data', (data) => {
      data = JSON.parse(data);

      logAsync('Start sequential execution', 1)
          .then(() => {
//            var result = manageDatabase();
            return logAsync('createDb finished ...('+'1'+')', 1);
          })
          .then(() => {
            var result = saveUserData(data);
//            console.log(result);
            return logAsync('saveUserData finished ...('+'1'+')', 1);
          })
          .then(() => {
            var result = checkData();

            uid = data.sub;
            name = data.name;
            req.session.uid = uid;
            req.session.name = name;
            req.session.isLogin  = 1;

            return logAsync('session info assigned finished ...', 1);
          })
          .then(() => {
            console.log('Save uid & name to session');
            res.redirect('/users');

            return logAsync('saveUserData finished ...', 1);
          });

    });

  }).on('error', (e) => {
    console.error(e);
  });

});


module.exports = router;


// database io

let mysql_config = JSON.parse(fs.readFileSync('service/mysql_config.json', 'utf-8'))


function checkData() {

  let sql_check_users = 'select modified, first_name, email FROM users';
  let sql_check_gamers = 'select modified, username, currency, carboin  FROM gamers';

  Database.execute( mysql_config,
      // first query
      database => database.query( sql_check_users )
          .then( rows => {
            someRows = rows;
            console.log(JSON.stringify(rows));

            return database.query( sql_check_gamers )
          } )
          .then( rows => {
            rows3 = rows;
            console.log(JSON.stringify(rows));
          } )
  ).then( () => {
    // do something with someRows and otherRows
  } ).catch( err => {
    // handle the error
    if (err) throw err;
  } );


  return '1';
}


function saveUserData(userData) {
  console.log('at saveUserData');

  const userid = userData['sub'];
  const email = userData['email'];
  const picture = userData['picture'];
  const given_name = userData['given_name'];
  const family_name = userData['family_name'];
  const locale = userData['locale'];

  var connection = mysql.createConnection(mysql_config);

  let sql_get_user = "SELECT * FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";

  // Update user data if already exists
  let sql_update_user = "UPDATE users SET first_name = '" + given_name + "', last_name = '" + family_name + "', email = '" +
      email + "', gender = ' ', locale = '" + locale + "', picture = '" + picture +
      "', link = ' ', modified = NOW() WHERE oauth_provider = 'google' AND oauth_uid = '" + userid + "'";

  let sql_create_user = "INSERT INTO users VALUES (NULL, 'google', '" + userid + "', '"+ given_name +"', '"+
      family_name +"', '"+ email +"', ' ', '" + locale + "', '"+picture+"', ' ', NOW(), NOW())";

  // create gamer data
  let sql_create_gamer = "INSERT INTO gamers VALUES (NULL, '"+ userid +"', '"+ given_name +
      "', 10000, 0, 10000, 0, -1 , NOW())";


  logAsync('Start sequential execution', 1)
    .then(() => {

      // get user data
      connection.query(sql_get_user, function(err, result, fields) {
        if (err) throw err;
//        console.log(result);
        let num_rows = result.length;
        if (num_rows > 0) {

          // Update user data if already exists
          connection.query(sql_update_user, function (err, result, fields) {
            if (err) throw err;
            console.log('User ' + given_name + family_name + ' existed ...');
            connection.end();
          });
        } else {

          // create user data
          connection.query(sql_create_user, function(err, result, fields) {
            if (err) throw err;
            console.log('create user data');
            // create gamer data
            connection.query(sql_create_gamer, function(err, result, fields) {
              if (err) throw err;
              console.log('create gamer data');
              console.log('User ' + given_name + family_name + ' added ...');
              connection.end();
            });
          });
        }
      });
      return logAsync('', 1);
    })
    .then(() => {
//      console.log('1');
      return logAsync('', 1);
    });

  return '1';

}

// var data = JSON.parse(string);


function manageDatabase(){
  console.log('at manageDatabase');

  const if_create = true;
  const if_delete = false;

  if (if_create) {
    Database.execute( mysql_config,
        // first query
        database => database.query( sql_create_users )
            .then( rows => {
              someRows = rows;
              console.log(JSON.stringify(rows));

              return database.query( sql_create_gamers )
            } )
            .then( rows => {
              rows3 = rows;
              console.log(JSON.stringify(rows));
            } )
    ).then( () => {
      console.log('Database created successfully ...')
      // do something with someRows and otherRows
    } ).catch( err => {
      // handle the error
      if (err) throw err;
    } );
  }


  if (if_delete) {
    connection = mysql.createConnection( mysql_config );

    var sql = "DROP TABLE users";
    connection.query(sql, function(err, result, fields) {
      if (err) throw err;
      console.log('Database deleted successfully ...')
    });
    connection.close()
  }

  return '1';
}

let sql_create_users = "CREATE TABLE users (" +
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

let sql_create_gamers = "CREATE TABLE gamers (" +
    "         id int(11) NOT NULL AUTO_INCREMENT," +
    "         oauth_uid varchar(50) COLLATE utf8_unicode_ci NOT NULL," +
    "         username varchar(25) COLLATE utf8_unicode_ci NOT NULL," +
    "         currency INT NOT NULL," +
    "         carboin INT NOT NULL," +
    "         max_currency INT NOT NULL," +
    "         max_carboin INT NOT NULL," +
    "         rank INT NOT NULL," +
    "         modified datetime NOT NULL," +
    "         PRIMARY KEY (id)" +
    "        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";

// for sequential access database
class Database {
  constructor( config ) {
    this.connection = mysql.createConnection( mysql_config );
  }
  query( sql, args ) {
    return new Promise( ( resolve, reject ) => {
      this.connection.query( sql, args, ( err, rows ) => {
        if ( err )
          return reject( err );
        resolve( rows );
      } );
    } );
  }
  close() {
    return new Promise( ( resolve, reject ) => {
      this.connection.end( err => {
        if ( err )
          return reject( err );
        resolve();
      } );
    } );
  }
}

Database.execute = function( config, callback ) {
  const database = new Database( config );
  return callback( database ).then(
      result => database.close().then( () => result ),
      err => database.close().then( () => { throw err; } )
  );
};



/*

  let someRows, otherRows, rows3;

  Database.execute( mysql_config,
  // first query
database => database.query( "SHOW tables" )
    .then( rows => {
      someRows = rows;
      console.log(JSON.stringify(rows));
      // second query
      return database.query( "SELECT * FROM users" )
    } )
    .then( rows => {
      otherRows = rows;
      console.log(JSON.stringify(rows));
      // second query
      return database.query( 'SELECT * FROM gamers' )
    } )
    .then( rows => {
      rows3 = rows;
      console.log(JSON.stringify(rows));
    } )
  ).then( () => {
    // do something with someRows and otherRows
  } ).catch( err => {
    // handle the error
    if (err) throw err;
  } );
* */