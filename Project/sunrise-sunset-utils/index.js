const axios = require('axios')

/* Get NOAA/ADDS station METAR */
const getSunriseSunsetJSON = async (lat, lng) => {

    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`

    let sunrise_sunset_result = null

    await axios.get(url)
        .then((response) => {
            sunrise_sunset_result = response.data
        })
        .catch((error) => {
            console.log(error);
        });

    return Promise.resolve(sunrise_sunset_result)
}

exports.getSunriseSunsetJSON = getSunriseSunsetJSON