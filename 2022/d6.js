const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map, unique } = require('underscore');

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
    data.forEach(seg => {
        findMarker(seg.line, 4);
    });
}

function part2(data) {
    console.log(`Processing Part 2`)
    data.forEach(seg => {
        findMarker(seg.line, 14);
    })
}

function findMarker(line, markerLength) {
    let marker = '';
    let markerPosition=-1;

    line.split('').map((c,i) => {
        if (markerPosition == -1 && i>markerLength-2 && checkUnique(line.substring(i-markerLength+1,i+1))) {
            markerPosition = i+1;
            marker = line.substring(i-markerLength+1,i+1);
        }
    })

    console.log(`marker ${marker} position is ${markerPosition}`)
}

function checkUnique(s) {
    let unique = true;

    for (const c of s) {
        if (s.match(new RegExp(c,'g')).length > 1) {
            unique = false;
            break;
        }
    }

    return unique;
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