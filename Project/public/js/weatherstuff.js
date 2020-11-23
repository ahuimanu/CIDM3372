const STATION_URL = "http://localhost:3000/stations/";
const METAR_VATSIM_URL = "http://localhost:3000/metar/";

const ADDS_METAR_URL = "http://localhost:3000/addsmetar/"
const ADDS_STATION_URL = "http://localhost:3000/addsstation/"

const SUNRISE_AND_SUNSET_URL = "http://localhost:3000/sunrise_sunset/"

//const SUNRISE_SUNSET_URL = `https://api.sunrise-sunset.org/json?lat=${metar.latitude[0]}&lng=${metar.longitude[0]}`
// const WEATHER_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KDEN%20KSEA%20PHNL&hoursBeforeNow=2";

// Define recursive function to print nested values
function printValues(obj) {
    for(var k in obj) {
        if(obj[k] instanceof Object) {
            printValues(obj[k])
        } else {
            console.log(obj[k])
        };
    }
};



const validateStation = async (station) => {
    return await fetch(`${STATION_URL}isvalid/${station}`)
}

const validateADDSStation = async (station) => {
    console.log(`${ADDS_STATION_URL}${station}`)
    return await fetch(`${ADDS_STATION_URL}${station}`)
}

const getMETAR = () => {

    const stationElement = document.querySelector('#metar')
    const station = stationElement.value;
    console.log(`entered: ${station}`)
    const alertPanelElement = document.querySelector('#alert_panel')

    validateADDSStation(station)
        .then(response => response.json())
        .then(json => {

            let icao = null
            let site = null
            try{
                icao = json.response.data[0].Station[0].station_id[0]
                site = json.response.data[0].Station[0].site[0]
            } catch(err) {
                alertPanelElement.classList.remove('w3-hide')
                alertPanelElement.classList.add('w3-show')
                stationElement.focus()
                stationElement.select()
                console.log("BAD CODE")
            }

            console.log(`RETURN VALUE FROM VALIDATE: ${icao}`)
            if( station !== icao){
                console.log(`ICAO ${icao} not found`)
                alertPanelElement.classList.remove('w3-hide')
                alertPanelElement.classList.add('w3-show')
            }
            else {
                alertPanelElement.classList.remove('w3-show')
                alertPanelElement.classList.add('w3-hide')

                fetch(`${ADDS_METAR_URL}${station}`)
                    .then(response => response.json())
                    .then(json => {

                        // printValues(json)
                        updateWeatherOutput(json, site)
                        
                })
            }
        })
}

const updateWeatherOutput = (json, site) => {

    // extract metar collection
    const metar = json.response.data[0].METAR[0]

    // <div id="station_id" class="weather-element"></div>
    //station id
    const station_id = metar.station_id[0]
    const station_id_output = `<strong>STATION:</strong> ${station_id}`
    const station_id_element = document.querySelector('#station_id')
    station_id_element.innerHTML = station_id_output

    // <div id="observation_time" class="weather-element"></div>
    const observation_time = metar.observation_time[0]
    const observation_time_output = `<strong>OBSERVED:</strong> ${observation_time}`
    const observation_time_element = document.querySelector('#observation_time')
    station_id_element.innerHTML = observation_time_output

    // <div id="raw_metar" class="weather-element"></div>
    //raw metar
    const raw_metar = metar.raw_text[0]
    const raw_metar_output = `<strong>METAR:</strong> ${raw_metar}`
    const raw_metar_element = document.querySelector('#raw_metar')
    raw_metar_element.innerHTML = raw_metar_output

    // <div id="latitude" class="weather-element"></div>
    //latitude
    const latitude = metar.latitude[0]
    // const latitude_output = `<strong>LAT:</strong> ${latitude}`
    // const latitude_element = document.querySelector('#latitude')
    // latitude_element.innerHTML = latitude_output

    // <div id="longitude" class="weather-element"></div>
    //longitude            
    const longitude = metar.longitude[0]
    // const longitude_output = `<strong>LON:</strong> ${longitude}`
    // const longitude_element = document.querySelector('#longitude')
    // longitude_element.innerHTML = longitude_output

    // MAP
    // move the map to this new position
    const zoom = 11;            
    mymap.flyTo([latitude, longitude], zoom);

    // set coords at top of page
    const headtext = document.querySelector('#headertext');
    headtext.textContent = `${site} - LAT: ${latitude} LON: ${longitude}`

    // <div id="temp" class="weather-element"></div>    
    //temp
    const temp_c = metar.temp_c[0];
    const temp_f = CtoF(temp_c)
    const temp_output = `<strong>TEMP:</strong> ${temp_c} C (${temp_f} F)`
    const temp_element = document.querySelector('#temp')
    temp_element.innerHTML = temp_output

    // <div id="dewpoint" class="weather-element"></div>    
    //dewpoint
    const dewpoint_c = metar.dewpoint_c[0];
    const dewpoint_f = CtoF(dewpoint_c)
    const dewpoint_output = `<strong>DEWPOINT:</strong> ${dewpoint_c} C (${dewpoint_f} F)`
    const dewpoint_element = document.querySelector('#dewpoint')
    dewpoint_element.innerHTML = dewpoint_output

    // <div id="wind" class="weather-element"></div>    
    //wind
    const wind_dir_degrees = metar.wind_dir_degrees[0]
    const wind_speed_kt = metar.wind_speed_kt[0]
    let wind_output = null    

    //check for gusts
    let wind_gust_kt = null
    if(metar.wind_gust_kt != undefined){
        wind_gust_kt = metar.wind_gust_kt[0]
        wind_output = `<strong>WIND:</strong> ${wind_dir_degrees} deg at ${wind_speed_kt} kts, gust ${wind_gust_kt} kts`
        console.log(`WIND GUST IS IN THE REPORT: ${wind_gust_kt}`)
    } else {
        wind_output = `<strong>WIND:</strong> ${wind_dir_degrees} deg at ${wind_speed_kt} kts`
    }
    const wind_element = document.querySelector('#wind')
    wind_element.innerHTML = wind_output

    
    // <div id="pressure" class="weather-element"></div>
    const altim_in_hg = metar.altim_in_hg[0].substring(0,5)
    const sea_level_pressure_mb = metar.sea_level_pressure_mb[0]
    let pressure_output = null

    // check if a US station - checking 50 states for now
    // TODO: look up territories
    if(metar.station_id[0].startsWith("K") || 
       metar.station_id[0].startsWith("PA") || 
       metar.station_id[0].startsWith("PH")){
        pressure_output = `<strong>PRESSURE:</strong> ${altim_in_hg} inHg (${sea_level_pressure_mb} hPa)`
    } else {
        pressure_output = `<strong>PRESSURE:</strong> ${sea_level_pressure_mb} hPa (${altim_in_hg} inHg)`
    }
    const pressure_element = document.querySelector('#pressure')
    pressure_element.innerHTML = pressure_output

    // <div id="sky_condition" class="weather-element"></div>
    // SKY CONDITION
    let sky_condition_output = `<strong>SKY COND:</strong><br>`
    const sky_condition_element = document.querySelector('#sky_condition')

    if(metar.sky_condition != undefined)
    {
        metar.sky_condition.forEach(sc => {
            sky_condition_output += `${sc.$.sky_cover} at ${sc.$.cloud_base_ft_agl} ft AGL<br>`
        })
        sky_condition_element.innerHTML = sky_condition_output
    }

    // <div id="flight_category" class="weather-element"></div>                
    const flight_category = metar.flight_category[0];
    let flight_category_output = null
    switch(flight_category){
        case 'VFR':
            flight_category_output = `<strong><span class="vfr-flight-category">${flight_category}</strong>`
            break;
        case 'MVFR':
            flight_category_output = `<strong><span class="mvfr-flight-category">${flight_category}</strong>`            
            break;
        case 'IFR':
            flight_category_output = `<strong><span class="ifr-flight-category">${flight_category}</strong>`            
            break;
        case 'LIFR':
            flight_category_output = `<strong><span class="lifr-flight-category">${flight_category}</strong>`            
            break;
    }
    const flight_category_element = document.querySelector('#flight_category')
    flight_category_element.innerHTML = flight_category_output

    // <div id="weather_icon" class="weather-element"></div>    

    // RECENT TABLE
    //check to see if the number of rows is 5 or less
    const metarTableElement = document.querySelector('#metar_table')
    const rowCount = metarTableElement.rows.length

    if(rowCount > 6)
    {
        metarTableElement.deleteRow(rowCount - 1)
    } else {

        const row = metarTableElement.insertRow(1)

        var stationIdCell = row.insertCell(0)
        stationIdCell.innerHTML = `${station_id}`

        var latitudeCell = row.insertCell(1)
        latitudeCell.innerHTML = `${latitude}`

        var longitudeCell = row.insertCell(2)
        longitudeCell.innerHTML = `${longitude}`

        var rawMETARCell = row.insertCell(3)
        rawMETARCell.innerHTML = `${raw_metar}`
    }
}

const selectWeatherIcon = async (json) => {

    // weather icons
    let weather_icon_img_src = "temp.jpg"
    let weather_icon_img_alt = "temp"    

    // extract metar collection
    const metar = json.response.data[0].METAR[0]

    // get sunrise and sunset info and then do weather operations
    

    
    
    //check for the presence of clouds and gusts
    if(metar.sky_condition != undefined && metar.wind_gust_kt)
    {
        //it is clear skies
        weather_icon_output = ``
    }
    

    let weather_icon_output = `<img src="${weather_icon_img_src}" alt="${weather_icon_img_alt}" class="w3-image">`

}

/* handle enter on the input box */
document.addEventListener("DOMContentLoaded", () => {
    const metarInputElement = document.querySelector('#metar')
    metarInputElement.focus()
    metarInputElement.addEventListener('keyup', evt => {
        if(evt.code === 'Enter'){
            evt.preventDefault();
            console.log('enter key pressedin metar input')
            getMETAR()
        }
    })    
});