// http://metar.vatsim.net/metar.php

// const localStorage = window.localStorage;
let mymap;


document.addEventListener("DOMContentLoaded", () => {

    if(!localStorage.getItem('position')) {
        handleGeoLocation();
    } else {
        console.log(`POSITION: ${localStorage.getItem('position')}`);
        userAgentPositionUpdate(localStorage.getItem('position'))
    }
});

const userAgentPositionUpdate = (position) => {

    const headtext = document.querySelector('#headertext');

    let lat = 0;
    let lon = 0;

    [lat, lon] = getUserAgentPosition(position)
    headtext.textContent = `LAT: ${lat} LON: ${lon}`;

    const zoom = 11;
    
    //create map
    if(mymap == null)
    {
        mymap = L.map('mapid')
                 .setView([lat, lon], zoom);

        // event handler
        mymap.on('click', (evt) => {
            //create popup
            var popup = L.popup();                 

            popup
                .setLatLng(evt.latlng)
                .setContent("You clicked the map at " + evt.latlng.toString())
                .openOn(mymap);
            }
        );
            
        // selecting a tile layer
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            //remember to protect your key: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/ 
            accessToken: 'pk.eyJ1IjoiYWh1aW1hbnU2OSIsImEiOiJja2k5bWRjcjUwZ3l6MnNtbjZlZzJrMWVtIn0.qXQsYCO6ndW4BIgIx23QGw'
        }).addTo(mymap);    
    } else {
        
    }
};

const handleGeoLocation = () => {
    // Handler when the DOM is fully loaded
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(userAgentPositionUpdate);
    }   
    else {    
        error('Geo Location is not supported');    
    }
}