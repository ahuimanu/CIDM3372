var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weather Form' });
});

router.post('/form', function(req, res, next) {
  console.log(req.body);
  res.render('formresponse', {bruh: req.body.stationid})
  // res.send(`BRUH recieved your request! ${req.body.stationid}`);
});

module.exports = router;
