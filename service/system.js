var mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
var db = require('../service/database');

let mysql_config;
try {
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.true.json', 'utf-8'));
}
catch (e) {
    mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));
}


mysql_config.multipleStatements = true;
//mysql_config.debug = true;



function growth(lands){

}

function temperature(lands){


}


function moisture(lands){
    /*
        return spawn('python', [
        "-u",
        path.join(__dirname, 'moisture.py'),
        "--foo", "some value for foo",
    ]);
     */
}


function environment(lands) {

    temperature(lands);
    moisture(lands);

}


function get_active_land(callback) {
    let connection = mysql.createConnection(mysql_config);
    // need to be changed to game start time todo
    let sql_check_user_activity = "SELECT id, gid, onset from users where " +
                                  "TIME_TO_SEC(timediff(now(),onset)) < 900 ;";
    console.log(sql_check_user_activity);
    connection.query(sql_check_user_activity, function (err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
            const data = JSON.parse(JSON.stringify(rows));
            console.log(data);

            let sql_get_land_loc = "";
            let arr = [];
            let n = 0;
            let uids = [];
            data.forEach(function (entry) {
                const uid = entry.id;
                const gid = entry.gid;
                uids.push(uid);
                sql_get_land_loc += "SELECT id, lon, lat, plant_time  from lands_" + (uid) +
                    " WHERE gid = "+(gid)+" AND valid IN (0,1);\n";
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
                        let all_lands = [];
                        user_lands.forEach(function (lands) {
                            let land_info = [];
                            lands.forEach(function (land) {

                                let t = land.plant_time.split(/[- T :]/);
                                let now = new Date(Date.now());
                                t[5]=t[5].split(/[Z]/)[0];
                                let d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

                                // here is wrong --> todo
                                const d_sec = (now - d)/1000.;
                                //if (d_sec < 900) {
                                // timing from 201401 - 201812
                                // 15 sec = 1 month
                                const d_month = Math.floor( d_sec/15);
                                let yr = 2014 +  Math.floor(d_month/12);
                                let mo = 1 + d_month%12;
                                land.plant_time = (yr)+leftPad(mo,2);
                                land.uid = uids[ind];
                                land.user_start = data[ind].modified;
//                                console.log(land);
                                all_lands.push(land)
                            });
                            ind = ind + 1;
//                        all_lands.push(land_info);
                        });
                        console.log(all_lands);
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