const express = require('express')
const cors = require('cors')
const app = express()

//apply cors middleware
app.use(cors());

const axios = require('axios')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()

const METAR_URL = "http://metar.vatsim.net/metar.php";
const WEATHER_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&hoursBeforeNow=2";

app.get('/metar/:station', (req, res) => {
    let station = req.params.station.toUpperCase()

    console.log(station)

    let metar 

    //VATSIM data pull
    axios.get(`${METAR_URL}?id=${station}`)
         .then((response) => {
            metar = response.data
            console.log(metar)
            res.send(metar)            
         })
         .catch((error) => {
            console.log(error);
         });

})

const parseMETARXml = (xml) => {

    let metar_data

    parser.parseString(xml, (err, result) => {
        if(err){
            throw err;
        }
        else{
            metar_data = result
        }
    })

    return metar_data;

}

app.get('/addsmetar/:station', (req, res) => {

    //https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&hoursBeforeNow=3&mostRecent=true&stationString=PHNL%20KSEA

    const stationString = req.params.station.toUpperCase()

    const url = `${WEATHER_URL}&stationString=${stationString}`

    axios.get(url)
        .then((response) => {
            let metarxml = response.data
            let parsed = parseMETARXml(metarxml)
            res.json(parsed)
        })
        .catch((error) => {
            console.log(error);
        });
})
 
app.listen(3000)