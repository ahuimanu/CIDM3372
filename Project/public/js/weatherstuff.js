const STATION_URL = "http://localhost:3000/stations/";
const METAR_VATSIM_URL = "http://localhost:3000/metar/";

const ADDS_METAR_URL = "http://localhost:3000/addsmetar/"
const ADDS_STATION_URL = "http://localhost:3000/addsstation/"
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
            
                        //station id
                        const station_id = json.response.data[0].METAR[0].station_id[0]
                        const station_id_output = `<strong>STATION:</strong> ${station_id}`
                        const station_id_element = document.querySelector('#station_id')
                        station_id_element.innerHTML = station_id_output
                        
                        //raw metar
                        const raw_metar = json.response.data[0].METAR[0].raw_text[0]
                        const raw_metar_output = `<strong>METAR:</strong> ${raw_metar}`
                        const raw_metar_element = document.querySelector('#raw_metar')
                        raw_metar_element.innerHTML = raw_metar_output
            
                        //latitude
                        const latitude = json.response.data[0].METAR[0].latitude[0]
                        const latitude_output = `<strong>LAT:</strong> ${latitude}`
                        const latitude_element = document.querySelector('#latitude')
                        latitude_element.innerHTML = latitude_output
            
                        //longitude            
                        const longitude = json.response.data[0].METAR[0].longitude[0]
                        const longitude_output = `<strong>LAT:</strong> ${longitude}`
                        const longitude_element = document.querySelector('#longitude')
                        longitude_element.innerHTML = longitude_output

                        // move the map to this new position
                        const zoom = 11;            
                        mymap.flyTo([latitude, longitude], zoom);
            
                        // set coords at top of page
                        const headtext = document.querySelector('#headertext');
                        headtext.textContent = `${site} - LAT: ${latitude} LON: ${longitude}`

                        //temp in c
                        const temp_c = json.response.data[0].METAR[0].temp_c[0];
                        const temp_f = CtoF(temp_c)
                        const temp_c_output = `<strong>TEMP:</strong> ${temp_c} C (${temp_f} F)`
                        const temp_c_element = document.querySelector('#temp_c')
                        temp_c_element.innerHTML = temp_c_output


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
                        
                })
            }
        })
}

/* handle enter on the input box */
document.addEventListener("DOMContentLoaded", () => {
    const metarInputElement = document.querySelector('#metar')
    metarInputElement.addEventListener('keyup', evt => {
        if(evt.code === 'Enter'){
            evt.preventDefault();
            console.log('enter key pressedin metar input')
            getMETAR()
        }
    })    
});