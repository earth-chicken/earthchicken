var mysql = require('mysql');
const fs = require('fs')

let mysql_config = JSON.parse(fs.readFileSync('service/mysql_config.json', 'utf-8'))

module.exports = {
    // Save user data to the database
    saveUserData: function (userData) {
        console.log('at saveUserData');

        const userid = userData['sub'];
        const email = userData['email'];
        const picture = userData['picture'];
        const given_name = userData['given_name'];
        const family_name = userData['family_name'];
        const locale = userData['locale'];

        var connection = mysql.createConnection(mysql_config);

        var sql = "SELECT * FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";
        connection.query(sql, function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            let num_rows = result.length;
            if (num_rows > 0) {
                // Update user data if already exists
                sql = "UPDATE users SET first_name = '" + given_name + "', last_name = '" + family_name + "', email = '" +
                    email + "', gender = ' ', locale = '" + locale + "', picture = '" + picture +
                    "', link = ' ', modified = NOW() WHERE oauth_provider = 'google' AND oauth_uid = '" + userid + "'";
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    console.log('User ' + given_name + family_name + ' existed ...');
                    connection.end();
                    console.log('Function: saveUserData finished ...');
                });
            } else {
                sql = "INSERT INTO users VALUES (NULL, 'google', '" + userid + "', '"+ given_name +"', '"+
                    family_name +"', '"+ email +"', ' ', '" + locale + "', '"+picture+"', ' ', NOW(), NOW())";
                connection.query(sql, function(err, result, fields) {
                    if (err) throw err;
                    console.log('User '+given_name + family_name +' adding ...');
                    connection.end();
                    console.log('Function: saveUserData finished ...');
                });
            }
        });
//        return given_name;
    },
    createDb: function(){
        console.log('at createDb');

        var connection = mysql.createConnection(mysql_config);
        var sql = "SHOW tables";
        connection.query(sql, function(err, result, fields) {
            if (err) throw err;
            obj = JSON.parse(result);
//            console.log(obj[0]);
            connection.end();
        });

        /*
        var sql = "DROP TABLE users";
        connection.query(sql, function(err, result, fields) {
          if (err) throw err;
        });
        */


        sql = "CREATE TABLE users (" +
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

        sql = "CREATE TABLE gamers (" +
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
            "        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"

        /*
        connection.query(sql, function(err,result){
            if(error){ throw err; }
            console.log('Creating table ...');
            console.log(result);
        });
        */



    },

    getGamerData: function (userData) {
        console.log('func getGamerData')
    }
};

