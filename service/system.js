var mysql = require('mysql');
const fs = require('fs');
const path = require('path')
const {spawn} = require('child_process')

let mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));
mysql_config.multipleStatements = true;
//mysql_config.debug = true;


function temperature(){


}


function moisture(){
//    console.log(Date.now().getDate());

    const now = new Date(Date.now());
    now.setMinutes(now.getMinutes()-15);

    const yr = now.getFullYear();
    const mo = now.getMonth();
    const day = now.getDate();
    const hr = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    let connection = mysql.createConnection(mysql_config);

    // need to be changed to game start time
    let sql_check_user_activity = "SELECT id, modified from users where modified >= TIME(\"" +
        +(yr)+"-"+(mo)+"-"+(day)+" "+(hr)+":"+(min)+":"+(sec)+"\")";
    console.log(sql_check_user_activity);

    connection.query(sql_check_user_activity, function (err, rows) {
        const data = JSON.parse(JSON.stringify(rows));
        console.log(data);

        let sql_get_land_loc = "";
        let arr = [];
        let n = 0;
        let uids = [];
        data.forEach(function (entry) {
            const uid = entry.id;
            uids.push(uid);
            sql_get_land_loc += "SELECT lon, lat, plant_time  from lands_" + (uid) + " WHERE valid = 1;\n";
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
//                    console.log(user_lands);
                    // if only one people, add
//                    console.log(isJson(user_lands[0]));
                    let bo = false;
                    try {
                        bo = typeof user_lands[0].lon == 'number'
                    }
                    catch (e) {

                    }

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
                            //                    if (d_sec < 900) {
                            // timing from 201401 - 201812
                            // 15 sec = 1 month
                            const d_month = Math.floor( d_sec/15);
                            let yr = 2014 +  Math.floor(d_month/12);
                            let mo = 1 + d_month%12;
                            land.plant_time = (yr)+leftPad(mo,2);
                            land.uid = uids[ind];
                            console.log(land);
                            land_info.push(land)
                        });
                        ind = ind + 1;
                        all_lands.push(land_info);
                    });
                    console.log(all_lands);
//                var a = uids


                }
            });
        }

    });
    /*
        return spawn('python', [
        "-u",
        path.join(__dirname, 'moisture.py'),
        "--foo", "some value for foo",
    ]);
     */
}

function growth(){

}

module.exports = {
    temperature: temperature,
    moisture: moisture,
    growth: growth,
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