// const { getSunriseSunsetJSON } = require("sunrise-sunset-utils");

const STATION_URL = "http://localhost:3000/stations/";
const METAR_VATSIM_URL = "http://localhost:3000/metar/";

const ADDS_METAR_URL = "http://localhost:3000/addsmetar/"
const ADDS_STATION_URL = "http://localhost:3000/addsstation/"
///sunrise_sunset/:lat/:lng
const SUNRISE_AND_SUNSET_URL = "http://localhost:3000/sunrise_sunset/"

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

const getSunriseSunset = async (lat, lng) => {
    console.log(`lat: ${lat} lon: ${lng}`)
    console.log(`${SUNRISE_AND_SUNSET_URL}${lat}/${lng}`)
    return await fetch(`${SUNRISE_AND_SUNSET_URL}${lat}/${lng}`)
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

const updateWeatherOutput = async (json, site) => {

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

    // <div id="temp" class="weather-element"></div>    
    //temp
    const temp_c = metar.temp_c[0];
    const temp_f = CtoF(temp_c)
    const temp_output = `<strong>TEMP:</strong> ${temp_c} C (${temp_f} F)`
    const temp_element = document.querySelector('#temp')
    temp_element.innerHTML = temp_output    

    // MAP
    // move the map to this new position
    const zoom = 11;            
    mymap.flyTo([latitude, longitude], zoom);
    const titleText = `${latitude} ${longitude}`
    const myIcon = L.divIcon({ className: 'myDivIcon',
                               html: '<i class="fas fa-map-marker-alt"></i>',
                               iconSize: [20, 20]
                            })
    const marker = L.marker([latitude, longitude], 
        {
            title: titleText,
            alt: "location",
            riseOnHover: true,
        })
    marker.addTo(mymap)
    marker.bindPopup(`<strong>STATION:</strong> ${station_id}<br>
                      <strong>TEMP:</strong> ${temp_c} C (${temp_f} F)`)
    marker.openPopup()

    // set coords at top of page
    const headtext = document.querySelector('#headertext');
    headtext.textContent = `${site} - LAT: ${latitude} LON: ${longitude}`

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
    let sea_level_pressure_mb = null
    if(metar.sea_level_pressure_mb != undefined){
        sea_level_pressure_mb = metar.sea_level_pressure_mb[0]
    }
    
    let pressure_output = null

    // check if a US station - checking 50 states for now
    // TODO: look up territories
    if(metar.station_id[0].startsWith("K") || 
       metar.station_id[0].startsWith("PA") || 
       metar.station_id[0].startsWith("PH")){
        pressure_output = `<strong>PRESSURE:</strong> ${altim_in_hg} inHg (${sea_level_pressure_mb} hPa)`
    } else {
        pressure_output = `<strong>PRESSURE:</strong> ${inHgtohPa(altim_in_hg)} hPa (${altim_in_hg} inHg)`
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
            if(sc.$.cloud_base_ft_agl != undefined) {
                sky_condition_output += `${sc.$.sky_cover} at ${sc.$.cloud_base_ft_agl} ft AGL<br>`
            } else {
                sky_condition_output += `${sc.$.sky_cover}<br>`
            }
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
    await selectWeatherIcon(json)

    // RECENT TABLE
    //check to see if the number of rows is 5 or less
    const metarTableElement = document.querySelector('#metar_table')
    const rowCount = metarTableElement.rows.length

    if(rowCount > 5)
    {
        metarTableElement.deleteRow(rowCount - 1)

        const row = metarTableElement.insertRow(1)

        var stationIdCell = row.insertCell(0)
        stationIdCell.innerHTML = `${station_id}`

        var latitudeCell = row.insertCell(1)
        latitudeCell.innerHTML = `${latitude}`

        var longitudeCell = row.insertCell(2)
        longitudeCell.innerHTML = `${longitude}`

        var rawMETARCell = row.insertCell(3)
        rawMETARCell.innerHTML = `${raw_metar}`        

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

/**
 * Takes metar json and calls the sunrise sunset api
 * to determine which weather icon to select.
 * @param {JSON} json 
 */
const selectWeatherIcon = async (json) => {

    // weather icons
    let weather_icon_img_src = "img/noaa/day/skc.png"
    let weather_icon_img_alt = "Default"    

    // extract metar collection
    const metar = json.response.data[0].METAR[0]
    const lat = metar.latitude[0]
    const lng = metar.longitude[0]

    // from the sky cover method
    let greatest = null

    // get sunrise and sunset info and then do weather operations
    await getSunriseSunset(lat, lng)
        .then(response => response.json())
        .then(json => {

            let rightnow =  new Date()

            let rightnowutc = new Date(rightnow.toUTCString())
            console.log(rightnowutc)

            let sunrise = new Date(Date.parse(json.results.sunrise))
            let sunset = new Date(Date.parse(json.results.sunset))

            console.log(`SUNRISE: ${sunrise} SUNSET: ${sunset} NOW: ${rightnowutc}`)

            //work with the times to select between night and day icons
            let day = rightnow > sunrise && rightnow < sunset 

            // check for wx string
            let wxstr = metar.wx_string != undefined
            // check for wind gusts            
            let gusts = metar.wind_gust_kt != undefined
            // check for sky conditions            
            let skycond = metar.sky_condition != undefined

            let low_coverage = false
            let high_coverage = false

            const IMG_DAY_PREFIX = "img/noaa/day/"
            const IMG_NIGHT_PREFIX = "img/noaa/night/"

            if(skycond){

                greatest = getGreatestSkyCover(metar.sky_condition)
                console.log(`GREATEST: ${greatest}`)

                switch(greatest) {
                    case "FEW":
                    case "SCT":
                        low_coverage = true
                        break
                    case "BKN":
                    case "OVC":
                        high_coverage = true
                        break
                }
            }

            //are there any METAR codes present?
            if(wxstr){

                // pattern matches
                // Regex patterns - https://www.w3schools.com/jsref/jsref_obj_regexp.asp
                // Regex look ahead and look behind - https://www.w3docs.com/learn-javascript/lookahead-and-lookbehind.html

                const wx_string = metar.wx_string[0]

                //SNOW
                //https://www.weather.gov/images/nws/newicons/sn.png
                const snow_pattern = /SN/g
                if(snow_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "snow"                    
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}sn.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nsn.png`
                    }
                }

                //SNOW and SNOW GRAINS
                const snow_frozen_pattern = /SN(?=.*SG)/g
                if(snow_frozen_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "snow"
                    if(day){
                        weather_icon_img_src = `${IMG_DAY_PREFIX}sn.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nsn.png`
                    }
                }

                //RAIN and SNOW
                //https://www.weather.gov/images/nws/newicons/ra_sn.png
                const rain_snow_pattern = /RA(?=.*SN)/g
                if(rain_snow_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "rain and snow"                    
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}ra_sn.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nra_sn.png`
                    }
                }

                //RAIN + ice (RA + IC|PE|PL|GR)
                //https://www.weather.gov/images/nws/newicons/raip.png
                const rain_ice_pattern = /RA(?=.*IC|.*PE|.*PL)/g
                if(rain_ice_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "rain and ice"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}raip.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nraip.png`
                    }
                }

                //Freezing RAIN (FZRA)
                //https://www.weather.gov/images/nws/newicons/fzra.png
                const freezing_rain_pattern = /FZRA/g
                if(freezing_rain_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "freezing rain"                    
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}fzra.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfzra.png`
                    }
                }

                //FREEZING RAIN (FZRA + RA)
                //https://www.weather.gov/images/nws/newicons/ra_fzra.png 
                const rain_freezing_rain_pattern = /RA(?=.*FZRA)/g
                if(rain_freezing_rain_pattern.exec(wx_string)) {
                    weather_icon_img_src = `${IMG_DAY_PREFIX}ra_fzra.png`
                    weather_icon_img_alt = "rain and freezing rain"                    
                }

                //FREEZING RAIN DRIZZLE SNOW (FZRA + SN)
                //https://www.weather.gov/images/nws/newicons/fzra_sn.png
                const freezing_rain_snow_pattern = /FZRA(?=.*SN)/g
                if(freezing_rain_snow_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "freezing rain and snow"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}fzra_sn.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfzra_sn.png`
                    }
                }

                //ICE CRYSTALS, ICE PELLETS, HAIL (IC PE PL GR)
                // https://www.weather.gov/images/nws/newicons/ip.png
                const ice_pattern = /IC|PE|PL|GR/g
                if(ice_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "freezing rain and snow"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}fzra_sn.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfzra_sn.png`
                    }
                }                

                //SNOW + ICE PELLETS (SN IC PE PL)
                //https://www.weather.gov/images/nws/newicons/snip.png
                const snow_ice_pattern = /SN(?=.*IC|.*PE|.*PL)/g
                if(snow_ice_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "snow and ice"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}snip.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nsnip.png`
                    }
                }

                //-RAIN, DRIZZLE, FOG/MIST (-RA DZ FG|BR)
                //https://www.weather.gov/images/nws/newicons/minus_ra.png
                const light_rain_pattern = /-RA|DZ/g
                if(light_rain_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "light rain"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}minus_ra.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nra.png`
                    }
                }

                const light_rain_mist_pattern = /-RA(?=.*BR)/g
                if(light_rain_mist_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "light rain"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}minus_ra.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nminus_ra.png`
                    }
                }                

                //RAIN, +RAIN + FOG/MIST, FOG (RA & FG|BR)
                //https://www.weather.gov/images/nws/newicons/ra.png
                const rain_pattern = /RA/g
                if(rain_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "rain"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}ra.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nra.png`
                    }
                }

                //RAIN SHOWERS (SHRA)
                //https://www.weather.gov/images/nws/newicons/shra.png
                const rain_showers_pattern = /SHRA/g
                if(rain_showers_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "rain showers"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}shra.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nshra.png`
                    }
                }

                //SHOWERS VICINITY + FOG/MIST, HAZE - https://www.weather.gov/images/nws/newicons/hi_shwrs.png
                const hi_shwrs_pattern = /VCSHRA/g
                if(hi_shwrs_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "showers in the vicinity"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}hi_shwrs.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}hi_nshwrs.png`
                    }
                }                

                //TSRA or VCTS or TS - https://www.weather.gov/images/nws/newicons/tsra.png
                const thunderstorm_pattern = /TSRA/g
                if(thunderstorm_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "Thunderstorm"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}tsra.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}ntsra.png`
                    }
                }

                //VCTSRA - https://www.weather.gov/images/nws/newicons/scttsra.png
                const thunderstorm_vicinity_pattern = /VCTSRA/g
                if(skycond){

                    if(thunderstorm_pattern.exec(wx_string) && low_coverage) {
                        weather_icon_img_alt = "Thunderstorm in the vicinity"
                        if(day) {
                            weather_icon_img_src = `${IMG_DAY_PREFIX}scttsra.png`
                        } else {
                            weather_icon_img_src = `${IMG_NIGHT_PREFIX}nscttsra.png`
                        }
                    }

                    //https://www.weather.gov/images/nws/newicons/hi_tsra.png
                    if(thunderstorm_pattern.exec(wx_string) && high_coverage) {
                        weather_icon_img_alt = "Thunderstorm in the vicinity"
                        if(day) {
                            weather_icon_img_src = `${IMG_DAY_PREFIX}hi_tsra.png`
                        } else {
                            weather_icon_img_src = `${IMG_NIGHT_PREFIX}hi_ntsra.png`
                        }
                    }                    
                }

                //DUST - https://www.weather.gov/images/nws/newicons/du.png
                const dust_pattern = /DU/g
                if(dust_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "Dust"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}du.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}ndu.png`
                    }
                }

                //SMOKE - https://www.weather.gov/images/nws/newicons/fu.png
                const smoke_pattern = /FU/g
                if(smoke_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "Smoke"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}fu.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfu.png`
                    }
                }

                //HAZE - https://www.weather.gov/images/nws/newicons/hz.png
                const haze_pattern = /HZ/g
                if(haze_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "Haze"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}hz.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nhz.png`
                    }
                }

                //FOG - https://www.weather.gov/images/nws/newicons/fg.png
                const fog_pattern = /FG/g
                if(fog_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "Fog"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}fg.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfg.png`
                    }
                }

                //MIST - https://www.weather.gov/images/nws/newicons/fg.png
                const mist_pattern = /BR/g
                if(mist_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "Fog/Mist"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}fg.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfg.png`
                    }
                }                

                //FUNNEL CLOUD - https://www.weather.gov/images/nws/newicons/fc.png
                const funnel_cloud_pattern = /FC/g
                if(funnel_cloud_pattern.exec(wx_string)) {
                    weather_icon_img_alt = "Funnel Cloud"
                    if(day) {
                        weather_icon_img_src = `${IMG_DAY_PREFIX}fc.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfc.png`
                    }
                }
                
                //TORNADO - https://www.weather.gov/images/nws/newicons/tor.png

                //HOT - https://www.weather.gov/images/nws/newicons/hot.png

                //COLD - https://www.weather.gov/images/nws/newicons/cold.png

                //BLIZZARD - https://www.weather.gov/images/nws/newicons/blizzard.png


            } else {
                //look for sky coverage
                if(skycond){
                    //check for gusts
                    if(gusts){
                        //WIND CLEAR - https://www.weather.gov/images/nws/newicons/wind_skc.png
                        if(greatest == "SKC") {
                            weather_icon_img_alt = "Windy"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}wind_skc.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nwind_skc.png`
                            }
                        } 
                        //WIND FEW - https://www.weather.gov/images/nws/newicons/wind_few.png
                        else if (greatest == "FEW") {
                            weather_icon_img_alt = "Few clouds and windy"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}wind_few.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nwind_few.png`
                            }
                        }
                        //WIND SCT - https://www.weather.gov/images/nws/newicons/wind_sct.png
                        else if (greatest == "SCT") {
                            weather_icon_img_alt = "Partly clouds"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}wind_sct.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nwind_sct.png`
                            }
                        }
                        //WIND BKN - https://www.weather.gov/images/nws/newicons/wind_bkn.png
                        else if (greatest == "BKN") {
                            weather_icon_img_alt = "Mostly cloudy"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}bkn.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nbkn.png`
                            }
                        }
                        //WIND OVR - https://www.weather.gov/images/nws/newicons/wind_ovc.png
                        else if (greatest == "OVC") {
                            weather_icon_img_alt = "Overcast"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}wind_ovc.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nwind_ovc.png`
                            }
                        }                        
                    } 
                    //no gusts
                    else {
                        //CLEAR - https://www.weather.gov/images/nws/newicons/skc.png
                        if(greatest == "SKC") {
                            weather_icon_img_alt = "Sky Clear"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}skc.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nskc.png`
                            }
                        } 
                        //FEW - https://www.weather.gov/images/nws/newicons/few.png
                        else if (greatest == "FEW") {
                            weather_icon_img_alt = "Few clouds"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}few.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nfew.png`
                            }
                        }
                        //SCT - https://www.weather.gov/images/nws/newicons/sct.png
                        else if (greatest == "SCT") {
                            weather_icon_img_alt = "Partly cloudy"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}sct.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nsct.png`
                            }
                        }
                        //BKN - https://www.weather.gov/images/nws/newicons/bkn.png
                        else if (greatest == "BKN") {
                            weather_icon_img_alt = "Mostly cloudy"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}bkn.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}nbkn.png`
                            }
                        }
                        //OVR - https://www.weather.gov/images/nws/newicons/ovc.png
                        else if (greatest == "OVC") {
                            weather_icon_img_alt = "Overcast"
                            if(day) {
                                weather_icon_img_src = `${IMG_DAY_PREFIX}ovc.png`
                            } else {
                                weather_icon_img_src = `${IMG_NIGHT_PREFIX}novc.png`
                            }
                        }
                    }
                } 
                // no sky conditions
                else {
                    //CLEAR - https://www.weather.gov/images/nws/newicons/skc.png

                    weather_icon_img_alt = "Sky Clear"
                    if(day) {
                        //https://www.weather.gov/images/nws/newicons/nskc.png
                        weather_icon_img_src = `${IMG_DAY_PREFIX}skc.png`
                    } else {
                        weather_icon_img_src = `${IMG_NIGHT_PREFIX}nskc.png`
                    }
                }
            }

            console.log(`GREATEST: ${greatest}`)

            let weather_icon_output = `<img src="${weather_icon_img_src}" alt="${weather_icon_img_alt}" class="w3-image">`
            const weather_icon_element = document.querySelector('#weather_icon')
            weather_icon_element.innerHTML = weather_icon_output

            console.log(`WEATHER ICON OUTPUT: ${weather_icon_output}`)

        })
        .catch(err => {
            console.log(`SUNRISE SUNSET ERROR: ${err}`)
        })
}

/**
 * Scan sky cover records from metar object to determine the greatest coverage extent
 * @param {Array} sky_cover 
 */
const getGreatestSkyCover = (sky_cover) => {

    let g = null
    let count = 0;
    sky_cover.forEach(record => {

        if(record.$.sky_cover == "OVX" || record.$.sky_cover == "OVC") {
            //overcast
            g = "OVC"
            console.log(`FOUND: OVC - layer: ${count}`)
        } else if (record.$.sky_cover == "BKN") {
            //broken
            g = "BKN"
            console.log(`FOUND: BKN - layer: ${count}`)
        } else if (record.$.sky_cover == "SCT") {
            //scattered
            g = "SCT"
            console.log(`FOUND: SCT - layer: ${count}`)
        } else if (record.$.sky_cover == "FEW") {
            //few
            g = "FEW"
            console.log(`FOUND: FEW - layer: ${count}`)
        } else if (record.$.sky_cover == "CAVOK" ||
                   record.$.sky_cover == "CLR" ||
                   record.$.sky_cover == "SKC" ) {
            //clear
            g = "SKC"
            console.log(`FOUND: SKC - layer: ${count}`)            
        }

        // switch(record.$.sky_cover){
        //     case "OVX":
        //     case "OVC":
        //         //overcast
        //         g = "OVC"
        //         console.log(`FOUND: OVC - layer: ${count}`)
        //         return g
        //     case "BKN":
        //         //broken
        //         g = "BKN"
        //         console.log(`FOUND: BKN - layer: ${count}`)
        //         return g
        //     case "SCT":
        //         //scattered
        //         g = "SCT"
        //         console.log(`FOUND: SCT - layer: ${count}`)
        //         return g
        //     case "FEW":
        //         //few
        //         g = "FEW"
        //         console.log(`FOUND: FEW - layer: ${count}`)
        //         return g
        //     case "CAVOK":
        //     case "CLR":
        //     case "SKC":
        //         //clear
        //         g = "SKC"
        //         console.log(`FOUND: SKC - layer: ${count}`)
        //         return g
        // }
    })

    return g

}

/**
 * Include response to hitting the enter key in the metar input box
 */
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