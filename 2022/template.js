const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/,'.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};

fs.readFile(file, function(err, input) {
    if(err) throw err;

    parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
}

function part2() {
    console.log(`Processing Part 2`)
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    data.input = [];

    arr.forEach((line,i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.input.push({line, index:i})
        }   
    });
}