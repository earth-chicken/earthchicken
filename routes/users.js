var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  const username = req.params.username;

  res.send(username + 'at user homepage');
});

router.get('/:username/dashboard', function(req, res, next) {
  const username = req.params.username;

  res.render('dashboard', { title: username} );
  res.end(username + 'at user dashboard');
  console.log(username + 'at user dashboard');
});

router.get('/:username/map', function(req, res, next) {
  const username = req.params.username;

  res.send(username + 'at user map');
});

module.exports = router;
