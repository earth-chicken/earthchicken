var mysql = require('mysql');
const fs = require('fs');

let mysql_config;
try {
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.true.json', 'utf-8'));
}
catch (e) {
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));
}


let sql_create_users_table = fs.readFileSync('service/sql_create_users_table.sql', 'utf-8');

let sql_create_user_land = " (" +
    "         id int(11) NOT NULL AUTO_INCREMENT," + // 1
    // land
    "         lon SMALLINT NOT NULL," +         // 2 -1800 - 1800 (lon*10)
    "         lat SMALLINT NOT NULL," +         // 3 -1800 - 1800 (lat*10)
    "         climate TINYINT NOT NULL," +      // 4 0 - 127
    "         valid TINYINT NOT NULL," +        // 5 0 or 1
    "         temperature SMALLINT NOT NULL," + // 6
    "         moisture TINYINT NOT NULL," +     // 7 0-100 (-128 - 127)
    "         productivity TINYINT NOT NULL," + // 8 0-100 (-128 - 127)
    "         fertilization TINYINT NOT NULL," +// 9 0, 20, 40 (-128 - 127)
    "         delta_temp TINYINT NOT NULL," +   // 10 -20 - 40 (d_temp*10)
    "         delta_moist TINYINT NOT NULL," +  // 11 (d_moist*10)
    "         warning_evt TINYINT NOT NULL," +   // 12 event warning
    "         event TINYINT NOT NULL," +         // 13 event
    // product
    "         type TINYINT NOT NULL," +         // 14 plant type#  0-
    "         plant_time datetime NOT NULL," +  // 15 0-100 (-128 - 127)
    "         completeness TINYINT NOT NULL," + // 16 0-100 (-128 - 127)
    //    "         healthiness TINYINT NOT NULL," + // 0-100 (-128 - 127)
    "         prod_rate FLOAT NOT NULL," +      // 17
    "         product TINYINT NOT NULL," +      // 18 0-100
    "         irrigate TINYINT NOT NULL," +      // 19 0 - 1
    "         fertilize TINYINT NOT NULL," +      // 20 0 - 1
    "         debug TINYINT NOT NULL," +      // 21 0 - 1
    "         greenhouse TINYINT NOT NULL," +      // 22 0 - 1
    "         created datetime NOT NULL," +     // 23
    "         modified datetime NOT NULL," +    // 24
    "         PRIMARY KEY (id)" +
    "        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";

function checkDatabase(callback) {

    var connection = mysql.createConnection(mysql_config);
    let sql_check_users_table = 'show tables';

    connection.query(sql_check_users_table, function (err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
            connection.end();
            callback('users table existed');
        } else {
            console.log('now need to create users table');
            connection.query(sql_create_users_table, function (err, rows) {
                if (err) throw err;
                connection.end();
                callback('users table new created');
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
        " NOW(), 0, NOW());";

    let sql_check_just_created = "SELECT id FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";

    let if_existed = true;
    let uid;
    let sql_check_land_table;
    var connection = mysql.createConnection(mysql_config);

    // check user if existed
    connection.query(sql_get_user, function (err, rows) {
        console.log(rows);
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
                if (err) throw err;
                // after create user
                // check created user id
//                console.log(sql_check_just_created);
                connection.query(sql_check_just_created, function (err, rows) {
                    if (err) throw err;
                    let result = rows[0];
                    uid = result.id;
                    sql_check_land_table = "SHOW TABLES LIKE 'land_"+ uid +"';";
//                    console.log(sql_check_land_table);
                    connection.query(sql_check_land_table, function (err, rows) {
                        if (err) throw err;
                        console.log(rows);
                        if (rows.length > 0) {
                            console.log('error during create user table.');
                        } else {
                            sql_create_user_land = "CREATE TABLE lands_" + uid + sql_create_user_land;
                            console.log(sql_create_user_land);
                            connection.query(sql_create_user_land, function (err, rows) {
                                if (err) throw err;
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
        if (err) throw err;
        let landData = JSON.stringify(rows);
        landData = JSON.parse(landData);
        connection.end();
        callback(landData);
    });
}

function evt_harvest(uid,lon,lat,callback) {

    checkLand(uid,lon,lat, (err,status)=> {
        if (err) throw 'database land self-inconsistent.';
//        if (status.valid == 1 && status.completeness >= 100) {
        if (status.valid == 1) {
           const p_type = status.type;

           // get price of p_type
           const price = 100;

           let earn = 100; // status.product * price;
            console.log('checkcheck');
           getMoney(uid, (currency)=> {
               let old_money = currency;
               let new_currency = old_money + earn;
               console.log('new_currency',new_currency);
               setMoney(uid, new_currency, () => {
                   console.log('checkcheck3');
                   console.log('Currency updated ...');

                   cleanLand(uid,lon,lat,function (err) {
                       console.log('Land cleaned ...');
                       callback(err, new_currency,earn);
                   });
               });
           });
       } else {
           console.log('no plant to be harvested ...')
           callback(1,null);
       }
    });
}

function checkLand(uid,lon,lat,callback) {

    let sql_check_land = "select valid, type, completeness, product from lands_"+(uid)+
        " WHERE lon = " + (lon) + " AND lat = " + (lat) + ";";
    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_check_land, (err,rows) => {
        if (err) throw  err;
        if (rows.length >= 1) {
            let data = JSON.parse(JSON.stringify(rows))[0];
            console.log('land status: ',data);
            connection.end();
            callback(null,data)
        } else {
            connection.end();
            callback(1);
        }
    });

}

function cleanLand(uid,lon,lat,callback) {
    let sql_clean_land = "update lands_" + (uid) + " " +
        "set valid = 0 " +
        " WHERE lon = " + (lon) + " AND lat = " + (lat) + ";";

    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_clean_land, (err,rows) => {
        if (err) throw  err;
        connection.end();
        callback(err);
    });
}

function addPlant(uid,lon,lat,p_type,prod_rate,callback) {
    let connection = mysql.createConnection(mysql_config);

    let sql_set_plant = "UPDATE lands_" + (uid) +
        " SET valid = 1, type = " + (p_type) + ", plant_time = NOW() , " +
        " completeness = 0, prod_rate = " + (prod_rate) + ", product = 0 , modified = NOW(), " +
        " irrigate = 0, fertilize = 0, debug = 0, greenhouse = 0" +
        " WHERE lon = " + (lon) + " AND lat = " + (lat) + ";";
    console.log(sql_set_plant);
    connection.query(sql_set_plant, (err, rows) => {
        if (err) throw  err;
        console.log('uid: '+(uid)+' '+(lon)+' '+(lat)+' plant successful ...');
        connection.end();
        callback(null)
    });
}

function evt_plant(uid,lon,lat,p_type,callback) {

    // todo add subroutine for check plant price and rate
    let cast = 10;
    let prod_rate = 1;

    console.log(lon,lat,p_type);

    checkLand(uid,lon,lat, function (err, status) {
        // check ownership
        if (status.valid == 0) {
            console.log('land '+(lon)+' '+(lat)+' valid');

            // spend currency
            castMoney(uid,cast, function (err,money) {
                if (err) {
                    // currency is not enough
                    callback(err,money);
                } else {
                    // add plant on land
                    addPlant(uid,lon,lat,p_type,prod_rate, function (err) {
                        if (err) throw 'planting error';
                        callback(null,money);
                    });
                }
            });

        } else if (status.valid == 1){
            console.log('There are plant on the land. request rejected ...')
            callback(1)
        }else if (status.valid == -1){
            console.log('The land is dead. request rejected ...')
            callback(1)
        }
    });
}

function evt_buy_land(uid,lon,lat,callback) {
    let temp = rows.temp;
    let moist = rows.moist;
    let pro = 100;
    let fer = 0;
    let climate = 1;

    // add subroutine for check land price
    let cast = 1000;
//    console.log(lon,lat);

    checkLand(uid,lon,lat, function (err, land_status) {
        if (err) {
            let param = [uid, lon, lat, climate, temp, moist, pro, fer];
            castMoney(uid,cast, function (err, money) {
                console.log(money);
                if (err) {
                    callback(err, money);
                } else {
                    addLand(param, function (err) {
                        if (err) throw 'system error when add land ...'
                        console.log('land added');
                        callback(err, money);
                    });
                }
            });
        } else {
            console.log('you have owned this land. request rejected ...')
            callback(1, null);
        }
    });

}

function addLand(param,callback) {
    let connection = mysql.createConnection(mysql_config);
    const uid = param[0];
    let sql_add_land = "INSERT INTO lands_"+(uid)+" VALUES (" +
        "NULL       , "+(param[1])+", "+(param[2])+", "+(param[3])+", 0, " +
        (param[4])+", "+(param[5])+", "+(param[6])+", "+(param[7])+", 0, " +
        "0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NOW(), NOW());";
    console.log(sql_add_land);
    connection.query(sql_add_land, (err,rows) => {
        if (err) throw  err;
        console.log('add land');
        connection.end();
        callback(null);
    });
}

function castMoney(uid,cast,callback) {

    getMoney(uid, (old_money)=> {
        let new_currency = old_money - cast;
        if (new_currency >= 0) {
            setMoney(uid, new_currency, () => {
                console.log('currency: ',new_currency,' updated ...')
                callback(null, new_currency);
            });
        } else {
            console.log(uid, 'currency: ',old_money ,' is not enough, request rejected ...')
            callback(1, old_money);
        }
    });

}

function setMoney(uid,new_currency,callback) {
    let sql_set_money = "UPDATE users SET currency = " + (new_currency) + " WHERE id = " + (uid) + ";";

    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_set_money, (err, rows) => {
        if (err) throw  err;
        connection.end();
        callback();
    });
}

function getMoney(uid,callback) {
    let sql_get_money = "SELECT currency from users WHERE id =" + (uid) + ';';

    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_get_money, (err, rows) => {
        if (err) throw  err;
        var data = JSON.parse(JSON.stringify(rows))[0];
        let money = data.currency;
        connection.end();
        callback(money);
    });
}

function checkAddOn(uid,lon,lat,action,callback) {
    let connection = mysql.createConnection(mysql_config);
    let sql_check_plant = "select valid, " + action + " from lands_"+(uid)+
        " WHERE lon = " + (lon) + " AND lat = " + (lat) + ";";

    connection.query(sql_check_plant, (err,rows) => {
        if(err) throw err;
        let data = JSON.parse(JSON.stringify(rows))[0];
        console.log('add-on status: ',data);
        callback(null,data);
    });

}

function useAddOn(uid,lon,lat,action,callback) {
    let connection = mysql.createConnection(mysql_config);
    let sql_add_moisture = "UPDATE lands_" + (uid) +
        " SET "+action+" = 1 " +
        " WHERE lon = " + (lon) + " AND lat = " + (lat) + ";";
    connection.query(sql_add_moisture, (err, rows) => {
        if(err) throw err;
        connection.end();
        callback(null);
    });
}

function evt_add_on(uid,lon,lat,evt,callback) {
    let action = evt.split(/[_]/);
    action = action[2];
    let cast = {irrigate:10,
        fertilize:100,
        debug:200,
        greenhouse:500,
    };

    console.log('doing '+action,' and need to cast ',cast[action]);

    checkAddOn(uid,lon,lat,action, function (err,result) {
        console.log(result);
        if (result[action]==0 && result['valid']==1) {
            castMoney(uid,cast[action], function (err, money) {
                if (err) {
                    callback(err, money);
                } else {
                    useAddOn(uid, lon, lat, action, function (err) {
                        console.log('add-on'+action+' used successfully ...');
                        callback(null, money);
                    })
                }
            });
        } else {
            console.log('you already added add-on'+action+' at '+(uid)+' '+(lon)+' '+(lat)+' ...');
            callback(1);
        }
    });

}

module.exports = {
    checkDatabase: checkDatabase,
    saveUserData: saveUserData,
    getUserStatus: getUserStatus,
    getUserLands: getUserLands,
    evt_buy_land: evt_buy_land,
    evt_plant: evt_plant,
    evt_harvest: evt_harvest,
    evt_add_on: evt_add_on,
};

