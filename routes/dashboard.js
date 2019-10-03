var express = require('express');
var router = express.Router();


/* GET dashboard listing. */
router.get('/:Id', function(req, res, next) {
  console.log(req.params.Id);

  res.render('dashboard', { title: req.params.Id} );
});

module.exports = router;
