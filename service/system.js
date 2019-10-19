var mysql = require('mysql');
const fs = require('fs');
const path = require('path');
//const {spawn} = require('child_process');
var db = require('../service/database');
var exec = require('child_process').exec;
var csv =require('csv-array');

var plantData;
csv.parseCSV('data/species_param.csv',function(data){
    plantData = data;
    data.forEach(function (d) {
    })
});

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
    
    //1) read user/land/plant data
    let connection = mysql.createConnection(mysql_config);

    let carboin_changes = [];
    let env_changes = [];
    lands.forEach(function(l) {
        console.log(l);
        var land ={
            temperature:l.temperature + l.delta_temp,
            moisture:l.moisture + l.delta_moist,
            productivity:l.productivity + l.delta_pro,
            fertilization:l.fertilization,
	    type:l.type,
        };
	var plant = plantData[land.type-1];
        var user ={
            carboin:0,};
	console.log('landData:',land);
        console.log('plantData:',plant);
	console.log('userData',user);
        console.log('=========================================read in');
        //2) calculate X, and reset carbon cash
        console.log('>>> calculate X <<<');
	
        let Ntep = OptTep(Number(land.temperature),Number(plant.ptep1),Number(plant.ptep2),Number(plant.Ntep)) ;
        let N  = OptGF(Number(land.productivity),Number(land.fertilization),Number(plant.oc1),Number(plant.oc2),Number(plant.Nwet),Number(plant.Nfer));
        if (land.moisture >= plant.pwet_min && land.moisture <= plant.pwet_max) {
            console.log('base rate:',plant.rate_ratio* 104,'Netp:',Ntep,'Ngf:',N.gf);
            var X = Ntep* N.gf* plant.rate_ratio* 104 ;
            console.log('with water: product carboin rate',Ntep*N.gf, X);
        } else {
            var X = 0;
            console.log('without water: product carboin rate',X);
        }

        //3) feedback
        console.log('>>> feedback <<<');
//        let deltaC = user.carboin + plant.Ncarboin * X;
        let deltaC =  X;
        let tempshift = 0;
//        let deltaPro = plant.productivity + N.oc * X;
        let deltaPro = N.oc * X;
//        let deltaMoi = user.delta_moist - N.wet* X;
        let deltaMoi = -N.wet* X;
	console.log(N.wet,X,'deltaMoi');
        let deltaTemp = tempshift;

        carboin_changes.push([l.uid,deltaC]);
        env_changes.push([l.uid,l.id,deltaTemp,deltaMoi,deltaPro]);
        console.log('uid & id=',l.uid,l.id);
	console.log('deltaMoi:',deltaMoi,'deltaPro:',deltaPro);

    //4) putin data
    });

    db.setCarboin(carboin_changes, function(err){

    });
    db.setLandData(env_changes, function (err) {

    });

}


function OptTep(Tep,Pt1,Pt2,Ntep){
   if (Tep < Pt2) {
        var N = ((Tep-Pt1) * (1-Ntep) / (Pt2-Pt1)) + Ntep;
	//console.log('OptTep case1_1',N);
	if (N <= Ntep) {var N = Ntep;}
	//console.log('OptTep case1:',N);
   } else { 
	//console.log(Tep-2*Pt2+Pt1,1-Ntep,Pt1-Pt2,Ntep);
	var N = (Tep-2*Pt2+Pt1) * (1-Ntep) / (Pt1-Pt2) + Ntep;
	//console.log('OprTep case2_1',N);
	if (N <= Ntep) {var N =Ntep;}
	//console.log('OptTep case2:',N);
   }
   return N;
}

function OptGF(Lpro,Lfer,oc1,oc2,Nwater,Nfer){
   if (Lfer == 0){
	var N ={
	    gf : Lpro /80,
	    oc : oc1, 
	    wet : 0,}
   } else {
	var N ={
	    gf : Nfer,
	    oc : oc2,
	    wet : Nwater,}
   };
   console.log('OptGF output:',N);
   return N;
}


function environment(lands) {
    //console.log(lands);
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


function get_active_land(opt,callback) {
    let all_lands = [];

    let connection = mysql.createConnection(mysql_config);
    let sql_check_user_activity;
    if (opt == 'env') {
        sql_check_user_activity = "SELECT id, gid, onset, TIME_TO_SEC(timediff(now(),onset)) from users where " +
            "TIME_TO_SEC(timediff(now(),onset)) < 900 ;";
    } else if (opt == 'gwt') {
        sql_check_user_activity = "SELECT id, gid, onset, TIME_TO_SEC(timediff(now(),onset)) from users where " +
            "TIME_TO_SEC(timediff(now(),onset)) < 900 ;";
    }
    console.log(sql_check_user_activity);
    connection.query(sql_check_user_activity, function (err, rows) {
        if (err) {
//            throw err;
//            console.log('facing db error, fetch again ...')
//            get_active_land(opt,function (err,lands) {
//                all_lands = lands;
//            });
        } else {
            if (rows.length > 0) {
                const data = JSON.parse(JSON.stringify(rows));
//            console.log(data);
                let sql_get_land_loc = "";
                let arr = [];
                let n = 0;
                data.forEach(function (entry) {
                    if (opt == 'env') {
                        sql_get_land_loc += "SELECT id, lon, lat from lands_" + (entry.id) +
                            " WHERE gid = "+(entry.gid)+" AND valid IN (0,1);\n";
                    } else if (opt == 'gwt') {
                        sql_get_land_loc += "SELECT id, lon, lat, moisture, temperature, productivity, fertilization, delta_temp, delta_moist, delta_pro, type from lands_" + (entry.id) +
                            " WHERE gid = "+(entry.gid)+" AND valid = 1;\n";
                    }

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
        get_active_land('env',function (err,lands) {
            if (err == null) {
                environment(lands);
            }
        });
        },15000);

    setTimeout(()=>{
        setInterval( ()=>{
            get_active_land('gwt',function (err,lands) {
                if (err == null) {
                    growth(lands);
                }
            });
        },2000);

    },1000);
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
