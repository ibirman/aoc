const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/,'.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';


fs.readFile(file, function(err, input) {
    if(err) throw err;

    let data = parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1(data);

    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`)
}

function part2(data) {
    console.log(`Processing Part 2`)
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    const data = [];

    arr.forEach((line,i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.push({line, index:i})
        }   
    });

    return data;
}