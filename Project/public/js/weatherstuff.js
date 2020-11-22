const METAR_URL = "http://localhost:3000/metar/";

const METAR_ADDS_URL = "http://localhost:3000/addsmetar/"

const WEATHER_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KDEN%20KSEA%20PHNL&hoursBeforeNow=2";

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

const getMETAR = () => {

    const stationElement = document.querySelector('#metar')
    const station = stationElement.value;

    //get VATSIM METAR
    // fetch(`${METAR_URL}${station}`)
    //     .then(response => response.text())
    //     .then(data => {
    //         console.log(data)
    //         const metaroutput = document.querySelector('#metar_raw')
    //         metaroutput.textContent = data
    //     })

    fetch(`${METAR_ADDS_URL}${station}`)
        .then(response => response.json())
        .then(json => {
            /*
            <METAR>
            <raw_text>KDEN 160353Z 15004KT 10SM FEW090 04/M08 A3014 RMK AO2 SLP191 T00441078 $</raw_text>
            <station_id>KDEN</station_id>
            <observation_time>2020-11-16T03:53:00Z</observation_time>
            <latitude>39.85</latitude>
            <longitude>-104.65</longitude>
            <temp_c>4.4</temp_c>
            <dewpoint_c>-7.8</dewpoint_c>
            <wind_dir_degrees>150</wind_dir_degrees>
            <wind_speed_kt>4</wind_speed_kt>
            <visibility_statute_mi>10.0</visibility_statute_mi>
            <altim_in_hg>30.138779</altim_in_hg>
            <sea_level_pressure_mb>1019.1</sea_level_pressure_mb>
            <quality_control_flags>
            <auto_station>TRUE</auto_station>
            <maintenance_indicator_on>TRUE</maintenance_indicator_on>
            </quality_control_flags>
            <sky_condition sky_cover="FEW" cloud_base_ft_agl="9000"/>
            <flight_category>VFR</flight_category>
            <metar_type>METAR</metar_type>
            <elevation_m>1656.0</elevation_m>
            </METAR>
            */
            // printValues(json)

            //station id
            const station_id = json.response.data[0].METAR[0].station_id[0]
            const station_id_output = `<strong>STATION:</strong> ${station_id}`
            console.log(station_id_output)
            const station_id_element = document.querySelector('#station_id')
            station_id_element.innerHTML = station_id_output
            
            //raw metar
            const raw_metar = json.response.data[0].METAR[0].raw_text[0]
            const raw_metar_output = `<strong>METAR:</strong> ${raw_metar}`
            console.log(raw_metar_output)
            const raw_metar_element = document.querySelector('#raw_metar')
            raw_metar_element.innerHTML = raw_metar_output

            //latitude
            const latitude = json.response.data[0].METAR[0].latitude[0];
            const latitude_output = `<strong>LAT:</strong> ${latitude}`
            console.log(latitude_output)
            const latitude_element = document.querySelector('#latitude')
            latitude_element.innerHTML = latitude_output

            //longitude            
            const longitude = json.response.data[0].METAR[0].longitude[0];
            const longitude_output = `<strong>LAT:</strong> ${longitude}`
            console.log(longitude_output)
            const longitude_element = document.querySelector('#longitude')
            longitude_element.innerHTML = longitude_output
           
            // move the map to this new position
            const zoom = 11;            
            mymap.flyTo([latitude, longitude], zoom);

            // set coords at top of page
            const headtext = document.querySelector('#headertext');
            headtext.textContent = `LAT: ${latitude} LON: ${longitude}`;


            //temp in c
            const temp_c = json.response.data[0].METAR[0].temp_c[0];
            const temp_f = CtoF(temp_c)
            console.log(`tempf: ${temp_f}`)
            const temp_c_output = `<strong>TEMP:</strong> ${temp_c} C (${temp_f} F)`
            console.log(`TEMP: ${temp_c_output}`)
            const temp_c_element = document.querySelector('#temp_c')
            temp_c_element.innerHTML = temp_c_output            

        })
}

