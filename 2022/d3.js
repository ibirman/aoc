const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'd3sample.txt';
const data = argv._[1] ?? '';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    let data = parseInput(input);
    //console.log(JSON.stringify(data, null, 2));
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
                    //console.log(`Matching type for bag ${bi} is ${c1.type} priority ${c1.priority}`);
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
    let total = 0;
    const groups = [];

    data.forEach((bag, bi) => {
        bag.matches = [];
        bag.badge = null;
        if (groups.length < bag.group) {
            groups.push({id:bag.group});
        }
        bag.compartment1.forEach(c1 => {
            if (bag.compartment2.findIndex(c2 => c2.type == c1.type) >= 0) {
                if (bag.matches.findIndex(m => m.type == c1.type) == -1) {
                    //console.log(`Matching type for bag ${bi} is ${c1.type} priority ${c1.priority}`);
                    bag.matches.push(c1)
                    total += c1.priority;
                }
            }
        })
    })

    groups.forEach(g => {
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(w => {
            let count = 0;
            data.filter(bag => bag.group == g.id).forEach(b => {
                if (searchBag(b, w)) {
                    count++;
                }
            });

            if (count == 3) {
                g.badge = w;
                g.priority = getWeight(w);
            }
        });
    });

    //console.log(groups);
    console.log(`Total priority of group badges is ${groups.reduce((total, g) => total + g.priority, 0)}`);

}

function searchBag(bag, itemType) {
    return bag.compartment1.findIndex(c => c.type == itemType) > -1 || bag.compartment2.findIndex(c => c.type == itemType) > -1;
}

function getWeight(itemType) {
    return ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(itemType);
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    const bags = [];
    let group = 1;

    arr.forEach((line,li) => {
        if (li>0 && li%3==0) {
            group++;
        }
        bags.push({
            group,
            compartment1: parseCompartment(line.substring(0,line.length/2)), 
            compartment2: parseCompartment(line.substring(line.length/2))
        });
    });

    return bags;
}

function parseCompartment(data) {
    const compartment = [];

    for (const element of data) {
        compartment.push({type:element,priority:getWeight(element)})
    }

    return compartment;
}