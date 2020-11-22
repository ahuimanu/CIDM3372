const CtoF = (temp) => {
    const tempC = parseFloat(temp)
    return Math.round((1.8 * tempC) + 32)
}

const FtoC = (temp) => {
    const tempF = parseFloat(temp)
    return Math.round(tempF * 0.5555555555555);   
}