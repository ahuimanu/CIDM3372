/*
Converter App using Node.

Meant to demonstrate the use of several basic aspects of the JavaScript language as a CLI program.

Useful article: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/

Potentially useful third-party packages from the node package manager repository:

yargs: https://www.npmjs.com/package/yargs
commander: https://www.npmjs.com/package/commander

unit conversions: 
https://www.unitconverters.net/
https://www.checkyourmath.com/

*/

const usageMessage = 
`
Usage: node converter.js <unit-from> <unit-to> <value-to-convert>
    length units:
        km: kilometers
        mi: miles    
        nm: nautical-miles        
        m: meters
        cm: centimeters
        y: yards        
        f: feet
    temperature units:
        C: celsius
        F: fahrenheit
        K: kelvin
    weight units:
        kg: kilograms
        g: grams
        lbs: pounds
        oz: ounces
`;

/**
 * Contain descriptors for a unit type
 * 
 * Using JavaScript classes - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes to 
 * collect various aspects about a UnitType in one place.
 * 
 * Also overrides Object.prototype.tostring
 */
class UnitType {

    abbreviation = '';  //unit abbreviation
    name = '';          //unit name
    type = '';          //unit type

    /* used to accept arguments required to construct a new instance */
    constructor(abbr, name, type) {
        this.abbreviation = abbr;
        this.name = name;
        this.type = type;
    }

    toString() {
        return `${this.abbreviation} | ${this.name} | ${this.type}`;
    }
    
}

// list of units
const units = 
[
    // length units:
    new UnitType('km', 'kilometers', 'length'),     // km: kilometers
    new UnitType('mi', 'miles', 'length'),          // mi: miles
    new UnitType('nm', 'nautical-miles', 'length'), // nm: nautical miles
    new UnitType('m', 'meters', 'length'),          // m: meters
    new UnitType('cm', 'centimeters', 'length'),    // cm: centimeters
    new UnitType('y', 'yards', 'length'),           // y: yards
    new UnitType('f', 'feet', 'length'),            // f: feet
    
    // temperature units:
    new UnitType('C', 'celsius', 'temperature'),    // C: celsius
    new UnitType('F', 'fahrenheit', 'temperature'), // F: fahrenheit
    new UnitType('K', 'kelvin', 'temperature'),     // K: kelvin
    
    // weight units:
    new UnitType('kg', 'kilograms', 'weight'),      // kg: kilograms
    new UnitType('g', 'grams', 'weight'),           // g: grams
    new UnitType('lbs', 'pounds', 'weight'),        // lbs: pounds
    new UnitType('oz', 'ounces', 'weight'),         // oz: ounces    
];

/* You might consider writing a method to check to see if the conversion provided
 * as an argument is in the list above
 */
function isInUnitsList(unit) {
    /* you could do argument checking in here 
     * consider using Array.prototype.some(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
}

/* You also need to check to see if the third argument is a number
 * consider using isNan(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
 */
function isNumeric(value) {
    /* you could do number checking in here */
}

/* This takes each of the parts and performs the conversion operation
 * first - the first unit type to convert - assumed to be either the abbrevation or the name
 */
function processConversion(first, second, value) {

    let converted = 0;

    /* I started this for you.  I use nested switches to cover the combinations */

    // look at the first arg
    switch(first) {
        // LENGTHS ////////////////////////////////////////////////////////////
        case 'km':
        case 'kilometers':
            // applicable second args for km
            switch(second) {
                // mi: miles                   
                case "mi":
                case "miles":
                    // https://www.unitconverters.net/length/km-to-miles.htm
                    converted = value * 0.6213711922;
                    break;
                // nm: nautical miles
                case "nm":
                case "nautical-miles":
                    // https://www.checkyourmath.com/convert/length/km_nautical_miles.php
                    converted = value / 1.852; 
                    break;
                // m: meters
                case "m":
                case "meters":
                    // https://www.unitconverters.net/length/km-to-m.htm
                    converted = value * 1000;
                    break;
                // cm: centimeters
                case "cm":
                case "centimeters":
                    // https://www.unitconverters.net/length/m-to-cm.htm                    
                    converted = value * 1000 * 100;
                    break;
                // y: yards
                case "y":
                case "yards":
                    // https://www.unitconverters.net/length/kilometer-to-yard.htm
                    converted = value * 1093.6132983377;
                    break;
                // f: feet
                case "f":
                case "feet":
                    // https://www.unitconverters.net/length/kilometer-to-foot.htm
                    converted = value * 3280.8398950131;
                    break;
            }
            break;
        
        case "mi":
        case "miles":
            switch(second) {
                // km: kilometers
                case "km":
                case "kilometers":
                    // https://www.unitconverters.net/length/miles-to-km.htm
                    converted = value * 1.609344;
                    break;
                // nm: nautical-miles
                case "nm":
                case "nautical-miles":
                    // https://www.checkyourmath.com/convert/length/km_nautical_miles.php
                    converted = value * 1.15078; 
                    break;
                // m: meters
                case "m":
                case "meters":
                    // https://www.checkyourmath.com/convert/length/miles_m.php
                    converted = value * 1609.344;
                    break;
                // cm: centimeters
                case "cm":
                case "centimeters":
                    // https://www.checkyourmath.com/convert/length/miles_cm.php          
                    converted = value * 1000 * 160934.4;
                    break;
                case "y":
                case "yards":
                    // https://www.checkyourmath.com/convert/length/miles_yards.php
                    converted = value * 1760;
                    break;
                // f: feet
                case "f":
                case "feet":
                    // https://www.checkyourmath.com/convert/length/miles_feet.php
                    converted = value => value * 5280;
                    break;
            }
            break;

        // continue with this on your own
        // remember to also do temperature and weight
        case "m":
        case "meters":
            break;

        case "cm":
        case "centimeters":
            break;

        case "y":
        case "yards":
            break;

        case "f":
        case "feet":
            break;

    }

    // if no path above matches, we'll return zero - you should check for this 
    return converted;
}

function main(){

    // hold the three arguments
    let first = null;
    let second = null;
    let value = 0;

    if (process.argv.length > 2) {

        // the first two arguments are node and the name of the file
        const args = process.argv.slice(2);

        /* TODO: arguments checking:
         * It is necessary to check the following:
         * are the first and second unit arguments recognized among the possible types?
         * is the third value argument a number?
         * 
         * I started some functions above that you might consider using
         */

        // call the conversion method and show results here      
        // this might help with fractions:         
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed  


    } else {
        /* if the correct number of arguments isn't given, remind how to use this utility */
        console.log(usageMessage);
    }
}

main();
