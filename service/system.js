var mysql = require('mysql');
const fs = require('fs');
const path = require('path');
//const {spawn} = require('child_process');
var db = require('../service/database');
var exec = require('child_process').exec;

let mysql_config;
try {
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.true.json', 'utf-8'));
}
catch (e) {
    console.log('Server MySQL config not found, use Raspberry Pi MySQL instead ...');
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));
}


mysql_config.multipleStatements = true;
//mysql_config.debug = true;



function growth(lands){

}

function environment(lands) {
    console.log(lands);

    // balance the calculation loading
    let sets = [[],[],[],[]];
    lands.forEach(function (land) {
        const mod = parseInt(land.weather_time.substring(0,4))%4;
        const data = {
            t: land.weather_time,
            lon: land.lon,
            lat: land.lat,
            uid: land.uid,
            gid: land.gid
        };
        sets[mod].push(data)
    });
//    console.log(sets);


    sets.forEach(function (spots) {
        let tmp = [];
        spots.forEach(function (spot) {
            tmp.push(spot.weather_time);
        });
        var time = tmp.filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
        });
        let dict = [];
        time.forEach(function (t) {
            dict.push([]);
        });
        spots.forEach(function (spot) {
            let ind = time.indexOf(spot.weather_time);
            dict[ind].push(spot);
        });
//        console.log(dict);

        if (dict.length > 0) {

        dict = JSON.stringify(dict);
        const cmd = 'python service/environment.py \'' + dict + '\'';
        console.log(cmd);
        execute(cmd, function (err, result) {
//            if (err) throw err;
            console.log(err);
            console.log(result);
            });
        }
    });

}


function get_active_land(callback) {
    let all_lands = [];

    let connection = mysql.createConnection(mysql_config);
    let sql_check_user_activity = "SELECT id, gid, onset, TIME_TO_SEC(timediff(now(),onset)) from users where " +
                                  "TIME_TO_SEC(timediff(now(),onset)) < 900 ;";
    console.log(sql_check_user_activity);
    connection.query(sql_check_user_activity, function (err, rows) {
        if (err) {
//            throw err;
            console.log('facing db error, fetch again ...')
            get_active_land(function (err,lands) {
                all_lands = lands;
            });
        } else {
            if (rows.length > 0) {
                const data = JSON.parse(JSON.stringify(rows));
//            console.log(data);
                let sql_get_land_loc = "";
                let arr = [];
                let n = 0;
                data.forEach(function (entry) {
                    sql_get_land_loc += "SELECT id, lon, lat from lands_" + (entry.id) +
                        " WHERE gid = "+(entry.gid)+" AND valid IN (0,1);\n";
                    n = n + 1;
                    arr.push(n);
                });

                console.log(sql_get_land_loc);
                if (arr.length > 0) {
                    connection.query(sql_get_land_loc,arr, function (err, rows) {
                        if (err) throw err;
                        if (rows.length > 0) {
                            let user_lands = JSON.parse(JSON.stringify(rows));
                            let ind = 0;
                            let bo = false;
                            try {
                                bo = typeof user_lands[0].lon == 'number'
                            }
                            catch (e) {}
                            if (user_lands.length == 1  || bo ) user_lands = [user_lands];
                            user_lands.forEach(function (lands) {
                                const dt = data[ind]['TIME_TO_SEC(timediff(now(),onset))'];

                                lands.forEach(function (land) {
                                    // timing from 201401 - 201812
                                    // 15 sec = 1 month
                                    const d_month = Math.floor(dt / 15);
                                    let yr = 2014 + Math.floor(d_month / 12);
                                    let mo = 1 + d_month % 12;
                                    land.weather_time = (yr) + leftPad(mo, 2);
                                    land.uid = data[ind].id;
                                    land.gid = data[ind].gid;
                                    land.user_onset = data[ind].onset;
                                    land.dt = dt;
//                                    land.lon = (land.lon)/10.;
//                                    land.lat = (land.lat)/10.;
                                    all_lands.push(land)
                                });
                                ind = ind + 1;
                            });
//                            console.log(all_lands);
                            connection.end();
                            callback(null,all_lands);
                        } else {
                            connection.end();
                            callback(1);
                        }
                    });
                } else {
                    connection.end();
                    callback(1);
                }
            } else {
                connection.end();
                callback(1);
            }
        }
    });
}

function nature() {
    setInterval( ()=>{
        get_active_land(function (err,lands) {
            if (err == null) {
                environment(lands);
                growth(lands);
            }
        });
        },5000);
}

module.exports = {
    nature: nature,
};

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stderr,stdout); });
}

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}