const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'q18sample.txt';
const data = argv._[1] ?? '';
let totalVersion = 0;

if (data != '') {
    console.log(data);
    part1(data);
}
else {
    fs.readFile(file, function(err, input) {
        if(err) throw err;

        let data = parseInput(input);
        part1(data);
    });
}

console.log(data)

function part1(data) {
    console.log(`Processing Part 1`)
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    return arr[0];
}