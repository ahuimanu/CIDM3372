const localStorage = window.localStorage;

const getUserAgentPosition = (position) => {
    let lat = 0;
    let lon = 0;

    if(!localStorage.getItem('position')){
        localStorage.setItem('position', position);
        localStorage.setItem('lat', position.coords.latitude);
        lat = position.coords.latitude;
        localStorage.setItem('lon', position.coords.longitude);
        lon = position.coords.longitude;        

        console.log(`writing: lat=${lat};lon=${lon}`);

    } else {
        lat = localStorage.getItem('lat');
        lon = localStorage.getItem('lon');

        console.log(`reading: lat=${lat};lon=${lon}`);        
    }
    
    return [lat, lon]
}