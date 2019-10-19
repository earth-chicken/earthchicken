var express = require('express');
var service = require('./service');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('at /');
    if(req.session.isLogin) {
        const uid = req.session.uid;
        console.log('uid is: ' + uid);
    }
    // 顯示 index.ejs
    res.render('index.ejs');
});

router.get('/login', function (req, res,next) {
    console.log('at /login');

    // is login already
    if(req.session.isLogin) {
        const uid = req.session.uid;
        console.log('uid is: ' + uid);
        console.log('redirect to /users');
        res.redirect('/users');

    } else {
        console.log('need to login');
        res.render('login.ejs',{title : 'login page'});
    }
});


router.get('/logout', function (req, res,next) {
    console.log('at /logout');

    req.session.destroy();
    res.redirect('/');
});


router.get('/about', function(req, res, next) {
  console.log('at /about');

  res.render('about.ejs',{
    title : 'about'
  })

});

router.get('/map', function(req, res, next) {
  console.log('at /about');

  res.render('map.ejs',{
    title : 'map'
  })

});


router.get('/introduce', function(req, res, next) {
  console.log('at /introduce');

  res.render('introduce.ejs',{
    title : 'introduce'
  })

});

router.get('/game', function(req, res, next) {
    console.log('at /game');

    if(req.session.isLogin) {
        uid = req.session.uid;
        name = req.session.name;
        console.log('uid is: ' + uid);

        service.getGamerData(uid,function (user,lands) {
            console.log(user);
            console.log(lands);
            res.render('game.ejs', {
                name: user.username,
                lands: '123'
            });
        });
    } else {
        console.log('need to login');
        res.redirect('/');
    }
});

module.exports = router;


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
