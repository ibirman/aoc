const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'd4sample.txt';
const data = argv._[1] ?? '';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    let data = parseInput(input);
    //console.log(JSON.stringify(data, null, 2));
    part1(data);

    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`);

    let total = 0;

    data.forEach(pair => {
        if (contains(pair.r1, pair.r2)) {
            total++;
        }
    });

    console.log(`Total ranges contained within the same pair ${total}`);
}

function part2(data) {
    console.log(`Processing Part 2`)

    let total = 0;

    data.forEach(pair => {
        if (contains(pair.r1,pair.r2) || overlaps(pair.r1, pair.r2)) {
            total++;
        }
    });

    console.log(`Total overlapping ranges ${total}`);
}

function contains(p1,p2) {
    let r1 = p1.sort((a,b) => a-b);
    let r2 = p2.sort((a,b) => a-b);

    return (r1[0]<=r2[0] && r1[1]>=r2[1]) || (r2[0]<=r1[0] && r2[1]>=r1[1])
}

function overlaps(p1,p2) {
    let r1 = p1.sort((a,b) => a-b);
    let r2 = p2.sort((a,b) => a-b);

    return (r1[0]<=r2[0] && r1[1]>=r2[0]) || (r2[0]<=r1[0] && r2[1]>=r1[0]);
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    const data = [];

    arr.forEach((line,i) => {
        const pairs = line.split(',');
        data.push({r1:pairs[0].split('-').map(n => n*1),r2:pairs[1].split('-').map(n => n*1)})
    });

    return data;
}