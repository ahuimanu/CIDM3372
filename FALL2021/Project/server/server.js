const express = require('express')
const favicon = require('serve-favicon')
const cors = require('cors')
const path = require('path')
const stations = require('stations-utils')
const sunrise_sunset = require('sunrise-sunset-utils')
const addsmetar = require('weather-utils')
const { stat } = require('fs')
const app = express()


//static files
app.use(express.static('public'));

//apply serve-favicon middleware
app.use(favicon(path.join(__dirname, 'img', 'favicon.ico')))
console.log(path.join(__dirname, 'img', 'favicon.ico'))

//apply cors middleware
app.use(cors());


// app.get('/metar/:station', (req, res) => {
//     let station = req.params.station.toUpperCase()
// })

app.get('/addsmetar/:station', (req, res) => {
    const stationString = req.params.station.toUpperCase()

    addsmetar.getNOAAADDSSMETAR(stationString)
        .then( metar => {
            console.log(`IN ADDSMETAR ENDPOINT ${metar}`)
            res.json(metar)
        })
        .catch(err => {
            console.log(`error getting NOAA ADDS METAR: ${err}`)
        })

})

app.get('/addsstation/:station', (req, res) => {
    const stationString = req.params.station.toUpperCase()

    addsmetar.getNOAAADDSStation(stationString)
        .then( record => {
            console.log(`IN ADDSSTATION ENDPOINT ${record}`)
            res.json(record)
        })
        .catch(err => {
            console.log(`error getting NOAA ADDS STATION: ${err}`)
        })        
})

app.get('/stations/check', (req, res) => {

    stations.checkForUpdateAsync()
        .then((message) => {
            console.log(message)
            res.send(`MSG: ${message}`)
        })
        .catch(err => {
            console.log(`BAD: ${err}`)
        })
})

app.get('/stations/testparse', (req, res) => {
    stations.parseStationsFileStringAsync()
        .then((stations) => {
            stationsList = stations
            res.send(`MSG: there are ${stations.length} stations in the list`)
        })
        .catch(err => {
            console.log(`BAD: ${err}`)            
        })
})

app.get('/stations/isvalid/:station', (req, res) => {
    const stationString = req.params.station.toUpperCase()

    console.log(`provided station: ${stationString}`)

    if(stationString.length == 4) {
        stations.parseStationsFileStringAsync()
            .then((stations) => {
                const found = stations.find(s => s.icao === stationString)
                if(found !== null)
                {
                    console.log(`found station: ${found.icao}`)
                    res.send(`${found.icao}`)
                }
                
            })
            .catch(err => {
                console.log(`BAD: ${err}`)            
            })
    }
})

app.get('/sunrise_sunset/:lat/:lng', (req, res) => {
    const lat = req.params.lat
    const lng = req.params.lng

    console.log(`provided lat: ${lat} lon: ${lng}`)

    sunrise_sunset.getSunriseSunsetJSON(lat, lng)
        .then((sunrise_sunset) => {
            res.json(sunrise_sunset)
        })
        .catch(err => {
            console.log(`BAD: ${err}`)            
        })    
})
 
app.listen(3000)