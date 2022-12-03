const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');
const weight = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

console.log(argv);

const file = argv._[0] ?? 'd3sample.txt';
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
    let total = 0;
    data.forEach((bag, bi) => {
        bag.matches = [];
        bag.compartment1.forEach(c1 => {
            if (bag.compartment2.findIndex(c2 => c2.type == c1.type) >= 0) {
                if (bag.matches.findIndex(m => m.type == c1.type) == -1) {
                    console.log(`Matching type for bag ${bi} is ${c1.type} priority ${c1.priority}`);
                    bag.matches.push(c1)
                    total += c1.priority;
                }
            }
        })
    })

    console.log(`Total priority of matches is ${total}`)
}

function part2(data) {
    console.log(`Processing Part 2`)
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    const bags = [];
    arr.forEach(line => {
        const compartment1 = [];
        for (let i=0;i<line.length/2;i++) {
            compartment1.push({type:line[i],priority:weight.indexOf(line[i])})
        }
        const compartment2 = [];
        for (let i=line.length/2;i<line.length;i++) {
            compartment2.push({type:line[i],priority:weight.indexOf(line[i])})
        }
        bags.push({compartment1, compartment2})
    });

    return bags;
}