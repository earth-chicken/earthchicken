var mysql = require('mysql');
const fs = require('fs');

let mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));

let sql_create_users_table = fs.readFileSync('service/sql_create_users_table.sql', 'utf-8');

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
    "         delta_moist TINYINT NOT NULL," + // (d_moist*10)
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
        let num_rows = rows.length;
//            console.log(JSON.stringify(num_rows));
        if (num_rows > 0) {
            let result = rows[0];
            if_existed = true;
            uid = result.id;
            console.log('update user');
            connection.query(sql_update_user, function (err, rows) {
                connection.end();
                callback( uid );
            });
        } else {
            if_existed = false;
            console.log(sql_create_user);
            connection.query(sql_create_user, function (err, rows) {
                // after create user
                // check created user id
//                console.log(sql_check_just_created);
                connection.query(sql_check_just_created, function (err, rows) {
                    let result = rows[0];
                    uid = result.id;
                    sql_check_land_table = "SHOW TABLES LIKE 'land_"+ uid +"';";
//                    console.log(sql_check_land_table);
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

function getUserStatus(uid,callback) {
    let sql_get_user_data = "SELECT * FROM users WHERE id = '"+uid+"'";
    let userData;
    let connection = mysql.createConnection(mysql_config);

    connection.query(sql_get_user_data, function(err, rows, fields) {
        if (err) throw err;
        userData = JSON.stringify(rows[0]);
        userData = JSON.parse(userData);
        connection.end();
        callback(userData);
    });
}

function getUserLands(uid,callback) {
    let sql_get_user_table = "SELECT * FROM lands_" + uid;
    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_get_user_table, function (err,rows,fields) {
        let landData = JSON.stringify(rows);
        landData = JSON.parse(landData);
        connection.end();
        callback(landData);
    });
}

function addLand(param,callback) {
    let connection = mysql.createConnection(mysql_config);
    const uid = param[0];
    let sql_add_land = "INSERT INTO lands_"+(uid)+" VALUES (NULL, "+(param[1]) +", "+ (param[2]) +", "+(param[3])+", 0, " +
                        (param[4])+", "+(param[5])+", "+(param[6])+", "+(param[7])+ ", 0, 0, NOW(), 0, 0, 0, 0, NOW(), NOW())";
    console.log(sql_add_land);
    connection.query(sql_add_land, (err,rows) => {
        if (err) throw  err;
        console.log('add land');
        connection.end();
        callback(rows);
    });
}

function castMoney(param,callback) {
    let connection = mysql.createConnection(mysql_config);

    let uid = param[0];
    let money = param[1];

    let sql_get_money = "SELECT currency from users WHERE id =" + (uid)+';';
    connection.query(sql_get_money, (err,rows) => {
        if (err) throw  err;

        var data = JSON.parse(JSON.stringify(rows))[0];
        let new_currency = data.currency - money;

        let sql_cast_money = "UPDATE users SET currency = " +(new_currency) + " WHERE id = "+(uid)+";";
        connection.query(sql_cast_money, (err,rows) => {
            if (err) throw  err;
            connection.end();
            callback({currency:new_currency});
        });
    });
}




module.exports = {
    checkDatabase: checkDatabase,
    saveUserData: saveUserData,
    getUserStatus: getUserStatus,
    getUserLands: getUserLands,
    addLand: addLand,
    castMoney: castMoney
};

