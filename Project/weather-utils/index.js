const axios = require('axios')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()

const METAR_URL = "http://metar.vatsim.net/metar.php";
const WEATHER_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&hoursBeforeNow=2";
const ADDS_STATION_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=stations&requestType=retrieve&format=xml"

class SkyCondition {
    /*
        sky_condition	                
            sky_cover -         up to four levels of sky cover and base can be reported under the sky_conditions field; OVX present when vert_vis_ft is reported. 
                                Allowed values: SKC|CLR|CAVOK|FEW|SCT|BKN|OVC|OVX	string	
            cloud_base_ft_agl - height of cloud base in feet AGL. Up to four levels can be reported under the sky_conditions field. 
                                A value exists when the corresponding sky_cover='FEW','SCT','BKN', 'OVC' integer ft (AGL)
    */
    constructor(sky_cover, cloud_base_ft_agl) {
        this.sky_cover = sky_cover
        this.cloud_base_ft_agl = cloud_base_ft_agl
    }
}

class METAR {
    /*
        https://aviationweather.gov/dataserver/fields?datatype=metar

        snow_in	                        Snow depth on the ground	float	in
        vert_vis_ft	                    Vertical Visibility	integer	ft
        metar_type	                    METAR or SPECI	string	
        elevation_m	                    The elevation of the station that reported this METAR	float	meters    
    */

    constructor(raw_text, station_id, observation_time, latitude, longitude, temp_c, dewpoint_c,
                wind_dir_degrees, wind_speed_kt, wind_gust_kt, visibility_statute_mi, altim_in_hg,
                sea_level_pressure_mb, quality_control_flags, wx_string, sky_condition, flight_category,
                three_hr_pressure_tendency_mb, maxT_c, minT_c, maxT24hr_c, minT24hr_c,
                precip_in, pcp6hr_in, pcp6hr_in, pcp24hr_in, snow_in, vert_vis_ft, 
                metar_type, elevation_m) {
                    
                    /* raw_text: The raw METAR (string)	*/
                    this.raw_text = raw_text

                    /* station_id: Station identifier; Always a four character alphanumeric(A-Z, 0-9). (string) */
                    this.station_id = station_id

                    /* observation_time: Time( in ISO8601 date/time format) this METAR was observed. (string ISO 8601 date/time) */
                    this.observation_time = observation_time

                    /* latitude: The latitude (in decimal degrees) of the station that reported this METAR.	(float decimal degrees) */
                    this.latitude = latitude

                    /* longitude: The longitude (in decimal degrees) of the station that reported this METAR. (float decimal degrees) */
                    this.longitude = longitude

                    /* temp_c: Air temperature (float C) */
                    this.temp_c = temp_c

                    /* dewpoint_c: Dewpoint temperature	float C */
                    this.dewpoint_c = dewpoint_c

                    /* wind_dir_degrees: Direction from which the wind is blowing. 0 degrees=variable wind direction. (integer degrees) */
                    this.wind_dir_degrees = wind_dir_degrees

                    /*wind_speed_kt: Wind speed; 0 degree wdir and 0 wspd = calm winds (integer kts) */                    
                    this.wind_speed_kt = wind_speed_kt

                    /* wind_gust_kt: Wind gust (integer kts) */
                    this.wind_gust_kt = wind_gust_kt

                    /* visibility_statute_mi: Horizontal visibility (float statute miles) */
                    this.visibility_statute_mi = visibility_statute_mi

                    /* altim_in_hg: Altimeter (float inches of Hg) */                    
                    this.altim_in_hg = altim_in_hg

                    /* sea_level_pressure_mb: Sea-level pressure (float mb) */
                    this.sea_level_pressure_mb = sea_level_pressure_mb

                    /* quality_control_flags: Quality control flags provide useful information about the METAR station(s) that provide the data. string 
                        corrected: Corrected
                        auto: Fully automated
                        auto_station: Indicates that the automated station type is one of the following: A01|A01A|A02|A02A|AOA|AWOS
                            NOTE: The type of station is not returned. This simply indicates that this station is one of the six stations enumerated above.
                        maintenance_indicator: Maintenance check indicator - maintenance is needed
                        no_signal: No signal
                        lightning_sensor_off: The lightning detection sensor is not operating- thunderstorm information is not available.
                        freezing_rain_sensor_off: The freezing rain sensor is not operating
                        present_weather_sensor_off: The present weather sensor is not operating
                     */
                    this.quality_control_flags = quality_control_flags

                    /* wx_string: wx_string descriptions (string): https://aviationweather.gov/docs/metar/wxSymbols_anno2.pdf */
                    this.wx_string = wx_string

                    /* sky_condition: a class for this entity has been created in this file
                            sky_cover - up to four levels of sky cover and base can be reported under the sky_conditions field; OVX present when vert_vis_ft is reported.
                                Allowed values: SKC|CLR|CAVOK|FEW|SCT|BKN|OVC|OVX (string)
                            cloud_base_ft_agl - height of cloud base in feet AGL. Up to four levels can be reported under the sky_conditions field. 
                                A value exists when the corresponding sky_cover='FEW','SCT','BKN', 'OVC' (integer ft (AGL))
                    */
                    this.sky_condition = sky_condition //expect array of SkyCondition objects

                    /* flight_category: Flight category of this METAR. Values: VFR|MVFR|IFR|LIFR
                            See http://www.aviationweather.gov/metar/help?page=plot#fltcat (string)
                    */
                    this.flight_category = flight_category

                    /* three_hr_pressure_tendency_mb: Pressure change in the past 3 hours (float mb) */
                    this.three_hr_pressure_tendency_mb = three_hr_pressure_tendency_mb

                    /* maxT_c: Maximum air temperature from the past 6 hours (float C) */
                    this.maxT_c = maxT_c

                    /* minT_c: Minimum air temperature from the past 6 hours (float C)*/
                    this.minT_c = minT_c

                    /* maxT24hr_c: Maximum air temperature from the past 24 hours: (float C) */
                    this.maxT24hr_c = maxT24hr_c

                    /* minT24hr_c: Minimum air temperature from the past 24 hours (float C) */
                    this.minT24hr_c = minT24hr_c

                    /* precip_in: Liquid precipitation since the last regular METAR (float in) */
                    this.precip_in = precip_in

                    /* pcp3hr_in: Liquid precipitation from the past 3 hours. 0.0005 in = trace precipitation (float in) */
                    this.pcp3hr_in = pcp3hr_in

                    /* pcp6hr_in: Liquid precipitation from the past 6 hours. 0.0005 in = trace precipitation (float in) */
                    this.pcp6hr_in = pcp6hr_in

                    /* pcp24hr_in: Liquid precipitation from the past 24 hours. 0.0005 in = trace precipitation (float in) */
                    this.pcp24hr_in = pcp24hr_in
                    this.snow_in = snow_in
                    this.vert_vis_ft = vert_vis_ft
                    this.metar_type = metar_type
                    this.elevation_m = elevation_m
    }

    toString(){
        return (`STATE: ${this.cd} | STATION: ${this.station} | ICAO: ${this.icao} |` +
                `IATA: ${this.iata} | LAT: ${this.lat} | LON: ${this.lon} | ELEV: ${this.elev}`)
    }

}

class Station {
    /*
        station_id	    The 4-letter station specifier	string
        wmo_id	        Four-letter WMO Id for the station, please refer to global WMO country information, for WMO codes	string
        latitude	    The latitude in decimal degrees	float (decimal) degrees
        longitude	    The longitude in decimal degrees	float (decimal) degrees

        elevation_m	    The elevation of the station (above mean sea-level)	float meters MSL
        site	        The "common" name/human-readable name of the station	string
        state	        The two-letter abbreviation for the U.S. state or Canadian province	string
        country	        The two-letter country abbreviation	string
        site_type	    The station type, which can be a combination of the following: METAR | rawinsonde | TAF | NEXRAD | wind_profiler | WFO_office | SYNOPS	string
    */
}

let stationsList = null

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

/* get VATSIM station metar */
const getVATSIMStationMETAR = (station) => {

    console.log(`RECV: ${station}`)

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
}

const getNOAAADDSStationMETAR = (station) => {
    
    const url = `${ADDS_STATION_URL}&stationString=${stationString}`

    axios.get(url)
        .then((response) => {
            let metarxml = response.data
            let parsed = parseMETARXml(metarxml)
            res.json(parsed)
        })
        .catch((error) => {
            console.log(error);
        });
}

const getNOAAADDSStation = (station) => {
    
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
}

