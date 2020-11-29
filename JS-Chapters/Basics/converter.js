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
    new UnitType('nm', 'nautical miles', 'length'), // nm: nautical miles
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

function isInUnitsList(unit) {
    return units.some(u => u.abbreviation);
}

function isNumeric(value) {
    return !isNaN(value);
}

function processConversion(first, second, value) {

    let converted = 0;

    // look at the first arg
    switch(first) {
        // LENGTHS ////////////////////////////////////////////////////////////
        case 'km':
            // applicable second args for km
            switch(second) {
                // mi: miles                   
                case "mi":
                    // https://www.unitconverters.net/length/km-to-miles.htm
                    converted = value * 0.6213711922;
                    break;
                // nm: nautical miles
                case "nm":
                    // https://www.checkyourmath.com/convert/length/km_nautical_miles.php
                    converted = value / 1.852; 
                    break;
                // m: meters
                case "m":
                    // https://www.unitconverters.net/length/km-to-m.htm
                    converted = value * 1000;
                    break;
                // cm: centimeters
                case "cm":
                    // https://www.unitconverters.net/length/m-to-cm.htm                    
                    converted = value * 1000 * 100;
                    break;
                // y: yards
                case "y":
                    // https://www.unitconverters.net/length/kilometer-to-yard.htm
                    converted = value * 1093.6132983377;
                    break;
                // f: feet
                case "f":
                    // https://www.unitconverters.net/length/kilometer-to-foot.htm
                    converted = value * 3280.8398950131;
                    break;
            }
            break;
        
        case 'mi':
            switch(second) {
                // mi: miles                   
                case "km":
                    // https://www.unitconverters.net/length/miles-to-km.htm
                    converted = value * 1.609344;
                    break;
                // nm: nautical miles
                case "nm":
                    // https://www.checkyourmath.com/convert/length/km_nautical_miles.php
                    converted = value * 1.15078; 
                    break;
                // m: meters
                case "m":
                    // https://www.checkyourmath.com/convert/length/miles_m.php
                    converted = value * 1609.344;
                    break;
                // cm: centimeters
                case "cm":
                    // https://www.checkyourmath.com/convert/length/miles_cm.php          
                    converted = value * 1000 * 160934.4;
                    break;
                // y: yards
                case "y":
                    // https://www.checkyourmath.com/convert/length/miles_yards.php
                    converted = value * 1760;
                    break;
                // f: feet
                case "f":
                    // https://www.checkyourmath.com/convert/length/miles_feet.php
                    converted = value => value * 5280;
                    break;
            }
            break;

        case 'm':
            break;

        case 'cm':
            break;

        case 'y':
            break;

        case 'f':
            break;

    }

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

        // parse unit types
        if (isInUnitsList(args[0]) && isInUnitsList(args[1])){
            // first unit            
            first = args[0];
            // second unit            
            second = args[1];
        } else {
            console.log(`unit type ${args[0]} and/or ${args[1]} unknown`);
            throw `unit type ${args[0]} and/or ${args[1]} unknown`;
        }

        // value
        if (isNumeric(args[2])){
            value = parseFloat(args[2]);
        } else {
            throw "value to convert must be a number";
        }

        // call the conversion method and show results here

        let converted = processConversion(first, second, value);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
        console.log(`${value} from ${first} to ${second} is ${converted.toFixed(2)}`);

    } else {
        console.log(usageMessage);
    }
}

main();
