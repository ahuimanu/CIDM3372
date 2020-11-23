# CIDM3372 Fall 2020 Final Project

The code presented here forms the basis of a final project for you to work on.  This represents a full-featured javascript-based front-end and backend.

This project obtains weather information from NOAA and utilizes mapping capabilities from leatlet and mapbox to depict weather information.

## Technologies Used

**Backend**
* NodeJS
* Axios
* XML2JS

**Frontend**
* fetch
* W3CSS

## Your Task

Your task is to complete the front-end with respect to some styling and all of the JavaScript that makes the front-end work.

### Creating Node Modules

To handle various backend aspects, I've created a set of node modules:

* station-utils - to read the NOAA stations.txt file
* weather-utils - to read the NOAA/ADDS data service
* sunrise-sunset-utils - to read the sunrise-sunset.org free api

Some guidance on creating node modules can be found here: [How To Create a Node.js Module](https://www.digitalocean.com/community/tutorials/how-to-create-a-node-js-module)

### Useful Resources for the NodeJS backend

* [NOAA Aviation Digital Data Service](https://aviationweather.gov/adds/)
* [TDS: METAR Field Descriptions](https://www.aviationweather.gov/dataserver/fields?datatype=metar)
* [Static METAR Plots data](https://www.aviationweather.gov/metar/help?page=plot#fltcat)
* [METAR and text symbol matching](https://www.aviationweather.gov/docs/metar/wxSymbols_anno2.pdf)
* [Symbol and METAR Code table](https://www.aviationweather.gov/metar/symbol)
* [NOAA Forecase Icons](https://www.weather.gov/forecast-icons)
* [Sunrise/Sunset API](https://sunrise-sunset.org/api)