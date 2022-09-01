const axios = require('axios').default
const { response } = require('express')

const STATIONS_FILE_URL = "https://aviationweather.gov/docs/metar/stations.txt"

class Station {
    constructor(cd, station, icao, iata, lat, lon, elev) {
        this.cd = cd
        this.station = station
        this.icao = icao
        this.iata = iata
        this.lat = lat
        this.lon = lon
        this.elev = elev
    }

    toString(){
        return (`STATE: ${this.cd} | STATION: ${this.station} | ICAO: ${this.icao} |` +
                `IATA: ${this.iata} | LAT: ${this.lat} | LON: ${this.lon} | ELEV: ${this.elev}`)
    }
}

const getStationsFileStringAsync = async () => {
    return await axios.get(STATIONS_FILE_URL)
}

const getStationsList = async () => {

}

const parseStationFromLine = (line) => {

    if(!line.startsWith("!") && line.length == 83) {

        let cd = line.substring(0,2).trim()
        let station = line.substring(3,19).trim()
        let icao = line.substring(20,24).trim()
        let iata = line.substring(26,29).trim()
        let lat = line.substring(39,45).trim()
        let lon = line.substring(47,54).trim()
        let elev = line.substring(55,59).trim()

        let stationObj = new Station(cd, station, icao, iata, lat, lon, elev)
        //console.log(stationObj.toString())
        return stationObj
        //console.log(station.toString())

        // console.log(`STATE: ${state} | STATION: ${station} | ICAO: ${icao} | IATA: ${iata} | LAT: ${lat} | LON: ${lon} | ELEV: ${elev}`)
        // console.log(`STATION: ${station}`)
        // console.log(`ICAO: ${icao}`)
        // console.log(`IATA: ${iata}`)
        // console.log(`LAT: ${lat}`)
        // console.log(`LON: ${lon}`)
        // console.log(`ELEV: ${elev}`)
    }
}

const parseStationsFileStringAsync = async () => {
    const stations = await getStationsFileStringAsync()
    const lines = stations.data.split("\n");

    const stationsList = []

    lines.forEach( (val, index, arr) => {
        if(val !== undefined){
            const sta = parseStationFromLine(val)
            if(sta != undefined){
                stationsList.push(sta)
            }
        }
    })
    
    return Promise.resolve(stationsList)
}

const checkForUpdateAsync = async () => {

    const stations = await getStationsFileStringAsync()
    //get today's date
    const today = Date.now()
    let message = ""

    let found = false

    const lines = stations.data.split("\n");
    lines.forEach( (val, index, arr) => {
        if(val.startsWith("! Date:")){
            const datepart = val.substring(8,19)
            const date_updated = Date.parse(datepart)
            message = `${date_updated}`
        } 
    })

    return Promise.resolve(message)    
}

exports.checkForUpdateAsync = checkForUpdateAsync
exports.parseStationsFileStringAsync = parseStationsFileStringAsync