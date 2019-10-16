var mysql = require('mysql');
const fs = require('fs');
const path = require('path')
const {spawn} = require('child_process')

let mysql_config = JSON.parse(fs.readFileSync('certs/mysql_config.rasp.json', 'utf-8'));

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



    let sql_check_user_activity = "SELECT id from users where modified >= TIME(\"" +
        +(yr)+"-"+(mo)+"-"+(day)+" "+(hr)+":"+(min)+":"+(sec)+"\")";
    console.log(sql_check_user_activity);

    connection.query(sql_check_user_activity, function (err, rows) {
        const data = JSON.parse(JSON.stringify(rows));
        console.log(data);

        data.forEach(function (entry) {
            const uid = entry.id;
            let sql_get_land_loc = "SELECT lon, lat, plant_time  from lands_"+(uid)+" WHERE valid = 1;";
            console.log(sql_get_land_loc);
            connection.query(sql_get_land_loc, function (err, rows) {
                const lands = JSON.parse(JSON.stringify(rows));
                console.log(lands);
                lands.forEach(function (entry) {
                    let t = entry.plant_time.split(/[- T :]/);
                    let now = new Date(Date.now());
                    t[5]=t[5].split(/[Z]/)[0];
                    let d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

                    const d_sec = (now - d)/1000.;
//                    if (d_sec < 900) {
                        // timing from 201401 - 201812
                        // 15 sec = 1 month
                        const d_month = Math.floor( d_sec/15);
                        let yr = 2014 +  Math.floor(d_month/12);
                        let mo = 1 + d_month%12;
                        console.log("Land time: "(yr)+" "+(mo));
//                    }
                });
            });
        })
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