var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weather Form' });
});

router.post('/form', async (req, res, next) => {

  //hold text for response
  let output = "";

  try{
    const url = `https://api.weather.gov/stations/${req.body.stationid}/observations/latest`

    // axios call
    const noaa = await axios.get(url);
  
    // extract data
    const report = noaa.data.properties;    

    output = `${report.rawMessage}`;

  }catch(err){
    console.error(`dude: ${err}`)
    output = "REPORT FAILED";
  }

  res.render('formresponse', {bruh: output});

});

module.exports = router;
