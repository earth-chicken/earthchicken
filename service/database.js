var mysql = require('mysql');
const fs = require('fs');
var csv = require('csv-array');

let species_param;
let species_param_head = [];
csv.parseCSV('data/species_param.csv', function(data){
    species_param = data;
    data.forEach(function (d) {
        species_param_head.push(d.species)
    })
});

// load action cast
let action_cast;
let action_cast_head = [];
csv.parseCSV('data/action_cast.csv', function(data){
    action_cast = data;
    data.forEach(function (d) {
        action_cast_head.push(d.species)
    });
});

let mysql_config;
try {
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.true.json', 'utf-8'));
}
catch (e) {
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));
}

mysql_config.multipleStatements = true;

let sql_create_users_table = fs.readFileSync('service/sql_create_users_table.sql', 'utf-8');

let sql_create_user_land = " (" +
    "         id int(11) NOT NULL AUTO_INCREMENT," + // 1
    // land
    "         lon MEDIUMINT NOT NULL," +         // 2 -180000 - 180000 (lon*1000)
    "         lat MEDIUMINT NOT NULL," +         // 3 -60000 - 60000 (lat*1000)
    "         climate TINYINT NOT NULL," +      // 4 0 - 127
    "         valid TINYINT NOT NULL," +        // 5 0 or 1
    "         temperature FLOAT NOT NULL," +    // 6
    "         rainfall FLOAT NOT NULL," +       // 7
    "         moisture FLOAT NOT NULL," +       // 8 0-100 (-128 - 127)
    "         productivity TINYINT NOT NULL," + // 9 0-100 (-128 - 127)
    "         fertilization TINYINT NOT NULL," +// 10 0, 20, 40 (-128 - 127)
    "         delta_temp TINYINT NOT NULL," +   // 11 -20 - 40 (d_temp*10)
    "         delta_moist FLOAT NOT NULL," +  // 12 (d_moist*10)
    "         delta_pro FLOAT NOT NULL," +  // 12 (d_moist*10)
    "         warning_evt TINYINT NOT NULL," +   // 13 event warning
    "         event TINYINT NOT NULL," +         // 14 event
    // product
    "         type TINYINT NOT NULL," +         // 15 plant type#  0-
    "         plant_time datetime NOT NULL," +  // 16 0-100 (-128 - 127)
    "         completeness TINYINT NOT NULL," + // 17 0-100 (-128 - 127)
    //    "         healthiness TINYINT NOT NULL," + // 0-100 (-128 - 127)
    "         prod_rate FLOAT NOT NULL," +      // 18
    "         product INT NOT NULL," +      // 19
    "         irrigate TINYINT NOT NULL," +      // 20 0 - 1
    "         fertilize TINYINT NOT NULL," +      // 21 0 - 1
    "         debug TINYINT NOT NULL," +      // 22 0 - 1
    "         greenhouse TINYINT NOT NULL," +      // 23 0 - 1
    "         created datetime NOT NULL," +     // 24
    "         updated datetime NOT NULL," +     // 25
    "         modified datetime NOT NULL," +    // 26
    "         gid INT NOT NULL," +    // 27
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

    let sql_get_user = "SELECT id, gid FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";

    // Update user data if already exists
    let sql_update_user = "UPDATE users SET first_name = '" + given_name + "', last_name = '" + family_name + "', email = '" +
        email + "', locale = '" + locale + "', picture = '" + picture +
        "', modified = NOW() WHERE oauth_provider = 'google' AND oauth_uid = '" + userid + "';";

    let sql_create_user = "INSERT INTO users VALUES (NULL, 'google', '" + userid + "', '" + given_name + "', '" +
        family_name + "', '" + email + "', '" + locale + "', '" + picture + "', '" + given_name + "', 10000, 0, 0, 10000, 0, 0, NOW()," +
        " NOW(), '2001-01-01',0 , 0, NOW());";

    let sql_check_just_created = "SELECT id, gid FROM users WHERE oauth_provider = 'google'" + " AND oauth_uid = '" + userData['sub'] + "'";

    let if_existed = true;
//    let uid;
    let sql_check_land_table;
    var connection = mysql.createConnection(mysql_config);

    // check user if existed
    connection.query(sql_get_user, function (err, rows) {
        console.log(rows);
        let num_rows = rows.length;
//            console.log(JSON.stringify(num_rows));
        if (num_rows > 0) {
            if_existed = true;
            let result  = JSON.parse(JSON.stringify(rows[0]));
            const uid = result.id;
            const gid = result.gid;
            console.log('update user');
            connection.query(sql_update_user, function (err, rows) {
                connection.end();
                callback(null, uid, gid);
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
                    let result  = JSON.parse(JSON.stringify(rows[0]));
                    uid = result.id;
                    gid = result.gid;
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
                                callback(null, uid, gid );
                            });
                        }
                    });
                });
            });
        }
    });
}

function getUserStatus(uid,callback) {
    let sql_get_user_data = "SELECT username, currency, carboin, onset, gid FROM users WHERE id = '"+uid+"'";
    let userData;
    let connection = mysql.createConnection(mysql_config);

    connection.query(sql_get_user_data, function(err, rows, fields) {
        if (err) throw err;
        userData = JSON.parse(JSON.stringify(rows[0]));
        connection.end();
        callback(userData);
    });
}


function get_userRank(uid,callback) {
    let sql_get_user_rank = "SELECT username, max_currency,  FROM mytable ORDER BY amount DESC LIMIT 5";

    let sql_get_user_data = "SELECT username, currency, carboin, onset, gid FROM users WHERE id = "+uid+";";
    let userData;
    let connection = mysql.createConnection(mysql_config);

    connection.query(sql_get_user_data, function(err, rows, fields) {
        if (err) throw err;
        userData = JSON.parse(JSON.stringify(rows[0]));
        connection.end();
        callback(userData);
    });
}


function checkGameTime(data,callback) {

    let t = data.onset.split(/[- T :]/);
    t[5] = t[5].split(/[Z]/)[0];
    let d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    let now = new Date(Date.now());
    const d_sec = (now - d) / 1000.;
    callback(null,d_sec,data);

}

function renewOnset(uid, callback) {
    let sql_renew_onset = "UPDATE users SET onset = NOW(), currency = 10000, carboin = 0, gid = gid+1, concluded = 0 WHERE id = ? ;";
//    sql_renew_onset += "DELETE FROM lands_?;";

    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_renew_onset, [uid,uid],(err, rows) => {
        if (err) throw  err;
        connection.end();
        callback(null);
    });

}

function if_gameStart(uid, callback) {

    getUserStatus(uid, function (data) {

        checkGameTime(data, function (err, game_time) {
            // if not in game time
            if (game_time > 900) {
                callback(null, false, data.gid, data.currency, data.carboin,900-game_time);
            } else {
                console.log('uid: ' + (uid) + ' gid: ' + (data.gid) + ' is in game now ...', game_time);
                callback(null, true, data.gid, data.currency, data.carboin,900-game_time);
            }
        });
    });
}


function evt_gameStart(uid, callback) {

    getUserStatus(uid, function (data) {

        checkGameTime(data, function (err, game_time) {
            // if not in game time
            if (game_time > 900) {
                let gid = data.gid + 1;
                renewOnset(uid, function (err) {
                    console.log('uid: ' + (uid) + ' gid: ' + (gid) + ' status renewed ...');
                    callback(null, gid, 10000, 0);
                })
            } else {
                console.log('uid: ' + (uid) + ' gid: ' + (data.gid) + ' is in game now ...', game_time);
                callback(1, data.gid, data.currency, data.carboin);
            }
        });
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


function addPlant(uid,gid,lon,lat,p_type,prod_rate,callback) {
    let connection = mysql.createConnection(mysql_config);

    let sql_set_plant = "UPDATE lands_" + (uid) +
        " SET valid = 1, type = " + (p_type) + ", plant_time = NOW() , " +
        " completeness = 0, prod_rate = " + (prod_rate) + ", product = 0 , modified = NOW(), " +
        " irrigate = 0, fertilize = 0, debug = 0, greenhouse = 0" +
        " WHERE gid = "+(gid)+" AND lon = " + (lon) + " AND lat = " + (lat) + ";";
    console.log(sql_set_plant);
    connection.query(sql_set_plant, (err, rows) => {
        if (err) throw  err;
        console.log('uid: '+(uid)+' '+(gid)+' '+(lon)+' '+(lat)+' plant successful ...');
        connection.end();
        callback(null)
    });
}

function setMoney(uid,new_currency,callback) {
    let sql_set_money = "UPDATE users SET currency = " + (new_currency) + " WHERE id = " + (uid) + ";";

    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_set_money, (err, rows) => {
        if (err) {
            console.log('facing error. do again');
            setMoney(uid, new_currency, () => {
                console.log('currency: ',new_currency,' updated ...');
                callback(null, new_currency);
            });
        }
        //throw  err;
        connection.end();
        callback(null);
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

function getCarboin(uid,callback) {
	    let sql_get_carboin = "SELECT carboin from users WHERE id =" + (uid) + ';';

	    let connection = mysql.createConnection(mysql_config);
	    connection.query(sql_get_carboin, (err, rows) => {
		            if (err) throw  err;
		            var data = JSON.parse(JSON.stringify(rows))[0];
		            let carb = data.carboin;
		            connection.end();
		            callback(carb);
		        });
}

function resetCarboin(uid,value,callback) {

	    getCarboin(uid, (old_carboin)=> {
		    let new_carboin = old_carboin + value;
            });
}


function getProduct(uid,callback) {
	    let sql_get_product = "SELECT product from users WHERE id =" + (uid) + ';';

	    let connection = mysql.createConnection(mysql_config);
	    connection.query(sql_get_product, (err, rows) => {
		            if (err) throw  err;
		            var data = JSON.parse(JSON.stringify(rows))[0];
		            let prod = data.product;
		            connection.end();
		            callback(prod);
		        });
}

function resetProduct(uid,value,callback) {

	    getMoney(uid, (old_product)=> {
		            let new_product = old_product - value;
	    });
}



function useAddOn(uid,gid,lon,lat,action,callback) {
    let connection = mysql.createConnection(mysql_config);
    let sql_add_moisture = "UPDATE lands_" + (uid) +
        " SET "+action+" = 1 " +
        " WHERE gid = "+(gid)+" AND lon = " + (lon) + " AND lat = " + (lat) + ";";
    connection.query(sql_add_moisture, (err, rows) => {
        if(err) throw err;
        connection.end();
        callback(null);
    });
}

function checkAddOn(uid,gid,lon,lat,action,callback) {
    let connection = mysql.createConnection(mysql_config);
    let sql_check_plant = "select valid, " + action + " from lands_"+(uid)+
        " WHERE gid = "+(gid)+" AND lon = " + (lon) + " AND lat = " + (lat) + ";";

    connection.query(sql_check_plant, (err,rows) => {
        if(err) throw err;
        let data = JSON.parse(JSON.stringify(rows))[0];
        console.log('add-on status: ',data);
        callback(null,data);
    });

}

function cleanLand(uid,gid,lon,lat,callback) {
    let sql_clean_land = "update lands_" + (uid) + " " +
        "set valid = 0 " +
        " WHERE gid = "+(gid)+" AND lon = " + (lon) + " AND lat = " + (lat) + ";";

    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_clean_land, (err,rows) => {
        if (err) throw  err;
        connection.end();
        callback(err);
    });
}

function addLand(uid, gid, lon, lat, climate, temp, moist, pro, fer,callback) {
    let connection = mysql.createConnection(mysql_config);
    let sql_add_land = "INSERT INTO lands_"+(uid)+" VALUES (" +
        "NULL       , "+(lon)+", "+(lat)+", "+(climate)+", 0, 0, 0, "+(moist)+", "+(pro)+", "+(fer)+", 0, " +
        "0, 0, 0, 0, 0, '2001-01-01', 0, 0, 0, 0, 0, 0, 0, NOW(), '2001-01-01', NOW(), "+(gid)+");";
    console.log(sql_add_land);
    connection.query(sql_add_land, (err,rows) => {
        if (err) throw  err;
        console.log('add land');
        connection.end();
        callback(null);
    });
}

function checkLand(uid,gid,lon,lat,callback) {

    let sql_check_land = "select valid, type, completeness, product from lands_"+(uid)+
        " WHERE gid = "+(gid)+" AND lon = " + (lon) + " AND lat = " + (lat) + ";";
    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_check_land, (err,rows) => {
//        console.log(rows);
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

function carboinChange(uid,chg,callback) {
    let sql_carboin_change = "UPDATE users SET carboin = carboin + " + (chg) +
        " WHERE id = " + (uid) + ";";
    sql_carboin_change += "SELECT carboin FROM users WHERE id = "+(uid)+ ";";
    let connection = mysql.createConnection(mysql_config);
    connection.query(sql_carboin_change,[], (err, rows) => {
        if (err) throw  err;
        let data = JSON.parse(JSON.stringify(rows))[1][0];
        console.log(data);
        callback(null, data.carboin)
    });
}


function getCarboinCast(plant,event) {

    console.log(species_param);
    console.log(species_param_head);

//    let csv_file =  fs.readFileSync('data/species_param.csv', 'utf-8');
//    console.log(csv_file);

//    console.log(data);


}


function evt_add_on(uid,gid,lon,lat,evt,callback) {
    let action = evt.split(/[_]/);
    action = action[2];
    let cast = {irrigate:10,
        fertilize:100,
        debug:200,
        greenhouse:500,
    };

    console.log('doing '+action,' and need to cast ',cast[action]);

    checkAddOn(uid,gid,lon,lat,action, function (err,result) {
        console.log(result);
        if (result['valid']==1) {
            if (result[action] == 0) {
                castMoney(uid, cast[action], function (err, money) {
                    if (err) {
                        callback(err, money);
                    } else {
                        useAddOn(uid, gid, lon, lat, action, function (err) {
                            console.log('add-on' + action + ' used successfully ...');
                            callback(null, money);
                        })
                    }
                });
            } else {
                console.log('you already added add-on'+ action +' at '+(uid)+' '+(gid)+' '+(lon)+' '+(lat)+' ...');
                callback(1);
            }
        } else {
            console.log('you haven\'t plant anything at '+(uid)+' ' +(gid)+' '+(lon)+' '+(lat)+' ...');
            callback(1);

        }
    });

}

function evt_harvest(uid,gid,lon,lat,callback) {

    checkLand(uid,gid,lon,lat, (err,status)=> {
        if (err) {
            console.log('you havent own this land');
            callback(1,null);
        } else {
            //        if (status.valid == 1 && status.completeness >= 100) {
            if (status.valid == 1) {
                const p_type = status.type;

                // todo get price of p_type
                const price = 100;
                const transfer_cast = -100;
                getCarboinCast();

                let earn = status.product * price;
                let carboin_chg = status.product * transfer_cast;

                carboinChange(uid, carboin_chg,  (err,carboin) => {
                    console.log('new carboin ',carboin);
                    getMoney(uid, (currency) => {
                        let old_money = currency;
                        let new_currency = old_money + earn;
                        console.log('new_currency ',new_currency);
                        setMoney(uid, new_currency, () => {
                            console.log('Currency updated ...');

                            cleanLand(uid,gid,lon,lat,function (err) {
                                console.log('Land cleaned ...');
                                callback(err, new_currency,earn, carboin, carboin_chg);
                            });
                        });
                    });

                });

            } else {
                console.log('no plant to be harvested ...')
                callback(1,null);
            }
        }
    });
}

function evt_plant(uid,gid,lon,lat,p_type,callback) {

    // todo add subroutine for check plant price and rate
    let cast = 10;
    let prod_rate = 1;
    getCarboinCast();


    console.log(lon,lat,p_type);
    console.log(uid,gid,lon,lat);
    checkLand(uid,gid,lon,lat, function (err, status) {
        // check ownership
        if (err) {
            console.log('You do not own this land. request rejected ...')
        } else {
            if (status.valid == 0) {
                console.log('land '+(lon)+' '+(lat)+' valid');
                // spend currency
                castMoney(uid,cast, function (err,money) {
                    if (err) {
                        // currency is not enough
                        callback(err,money);
                    } else {
                        // add plant on land
                        addPlant(uid,gid,lon,lat,p_type,prod_rate, function (err) {
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
        }
    });
}

function evt_buy_land(uid,gid,lon,lat,callback) {
    let temp = rows.temp;
    let moist = rows.moist;
    let pro = 100;
    let fer = 0;
    let climate = 1;

    // add subroutine for check land price
    let cast = 1000;
//    console.log(lon,lat);

    checkLand(uid,gid,lon,lat, function (err, land_status) {
        if (err) {
            castMoney(uid,cast, function (err, money) {
                console.log(money);
                if (err) {
                    callback(err, money);
                } else {
                    addLand(uid, gid, lon, lat, climate, temp, moist, pro, fer, function (err) {
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

function setCarboin(changes,callback) {

    let sql_set_carboin = "";
    changes.forEach(function (chg) {
        sql_set_carboin += "UPDATE users SET carboin = carboin + " +(chg[1])+ " WHERE id = " +(chg[0])+ ";";
    });
    console.log(sql_set_carboin);
	let connection = mysql.createConnection(mysql_config);
	connection.query(sql_set_carboin,[], (err, rows) => {
	    if (err) throw err;
	    connection.end();
	    callback(null);
	});
}

function setLandData(changes,callback) {
    let sql_set_value = "";
    changes.forEach(function (chg) {
        sql_set_value += "UPDATE lands_" +(chg[0])+
            " SET delta_temp = delta_temp + "+(chg[2])+" ," +
            "delta_moist = delta_moist + "+(chg[3])+ " ," +
            "delta_pro = delta_pro + "+(chg[4])+" ,"+
            "product = product + "+(chg[5])+" WHERE id = " +(chg[1])+ ";";
    });
    console.log(sql_set_value);
   let connection = mysql.createConnection(mysql_config);
   connection.query(sql_set_value,[], (err, rows) => {
       if (err) throw err;
       connection.end();
       callback(null);
   });
}


function updateUserHistory(uid,callback) {
    let connection = mysql.createConnection(mysql_config);
    let sql_update_user_history = "UPDATE users " +
        "SET max_currency = currency, max_carboin = carboin, achieved = NOW() " +
        "WHERE currency > max_currency AND id = "+(uid)+";";
    connection.query(sql_update_user_history,[], (err, rows) => {
        if (err) throw err;
        connection.end();
        callback(null);
    });
}

function concludeUserProperty(uid,gid,callback) {
    let connection = mysql.createConnection(mysql_config);
    let sql_check_property = "SELECT id from lands_"+(uid)+ " WHERE gid = "+(gid)+" AND valid in (0,1);";
    connection.query(sql_check_property,[], (err, rows) => {
        if (err) throw err;
        const nland = rows.length;
        var ind_buy_land = action_cast[0]['p_user_evt_buyLand'] * -1;
        const land_to_currency = nland * action_cast[ind_buy_land].chg_currency;
        let sql_add_currency = "UPDATE users SET currency = currency + "+(land_to_currency)+ ", concluded = 1 " +
            "WHERE id = "+(uid)+";";
        connection.query(sql_add_currency,[], (err, rows) => {
            if (err) throw err;
            connection.end();
            callback(null);
        });
    });


}

module.exports = {
    checkDatabase: checkDatabase,
    saveUserData: saveUserData,
    getUserStatus: getUserStatus,
    evt_gameStart: evt_gameStart,
    getUserLands: getUserLands,
    evt_buy_land: evt_buy_land,
    evt_plant: evt_plant,
    evt_harvest: evt_harvest,
    evt_add_on: evt_add_on,
    setCarboin: setCarboin,
    setLandData: setLandData,
    resetCarboin: resetCarboin,
    resetProduct: resetProduct,
    if_gameStart: if_gameStart,
    get_userRank: get_userRank,
    concludeUserProperty: concludeUserProperty,
    updateUserHistory: updateUserHistory,
};

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
}
