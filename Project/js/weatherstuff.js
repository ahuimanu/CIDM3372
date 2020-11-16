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
    fetch(`${METAR_URL}${station}`)
        .then(response => response.text())
        .then(data => {
            console.log(data)
            const metaroutput = document.querySelector('#metar_raw')
            metaroutput.textContent = data
        })

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
            const raw_metar = json.response.data[0].METAR[0].raw_text[0]
            console.log(`raw metar: ${raw_metar}`)

            const metarxmloutput = document.querySelector('#metar_xml')
            metarxmloutput.textContent = raw_metar
        })
}

