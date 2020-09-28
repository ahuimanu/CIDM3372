/*
Converter App using Node.

Meant to demonstrate the use of several basic aspects of the JavaScript language as a CLI program.

Useful article: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/

Potentially useful third-party packages from the node package manager repository:

yargs: https://www.npmjs.com/package/yargs
commander: https://www.npmjs.com/package/commander
*/


const readline = require("readline");



const usageMessage = 
`
Usage: node unit_convert.js <unit-from> <unit-to> <value-to-convert>
    length units:
        km: kilometers
        mi: miles    
        m: meters
        cm: centimeters
        y: yards        
        f: feet

`;

const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout,
        error: process.stderr,
    }
);

function theGoodFoot(input) {
    console.log(input);
    rl.close();
}

function checkQuit(input) {
    if (input === "Y" || input === "y") {
        process.exit(0);
    }
}

function main(){

    if (process.argv.length > 2) {
        console.log(process.argv.slice(2));
    } else {
        console.log(usageMessage);
    }
    
    rl.question("What do you say?\n> ", (answer) => theGoodFoot(answer));
}

main();


