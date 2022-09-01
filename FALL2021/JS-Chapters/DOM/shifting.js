function intervals(){
    setInterval(doStuff, 1000);
}

function doStuff(){

    let timeInfoElement = document.getElementById("timeinfo");
    timeInfoElement.innerHTML = `${new Date(Date.now()).toString()}`;

    let areas = document.querySelectorAll(".grid-container > div");

    areas.forEach(area => {
        let r = Math.random() * 255;
        console.log(`random red is: ${r}`);
        let g = Math.random() * 255;
        let b = Math.random() * 255;
        let a = Math.random();
        area.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    });
}