const CtoF = (temp) => {
    const tempC = parseFloat(temp)
    return Math.round((1.8 * tempC) + 32)
}

const FtoC = (temp) => {
    return Math.round(parseFloat(temp) * 0.5555555555555);   
}

const inHgtohPa = (inHg) => {
    // inHq to hPa conversion value found here http://convert-to.com/conversion/pressure/convert-in-of-hg-to-hpa.html
    return Math.round((parseFloat(inHg) * 33.86))
}