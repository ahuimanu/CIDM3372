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