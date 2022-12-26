const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};

fs.readFile(file, function(err, input) {
    if (err) throw err;

    parseInput(input);
    part1();
    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    showGrid();

    let moves = -1;
    let round = 1;
    while (moves != 0) {
        moves = doRound();
        console.log(`After round ${round++}`)
        showGrid();
    }
}

function part2() {
    console.log(`Processing Part 2`)
}

function doRound() {
    console.log(data.directions);
    consider();
    let moves = move();
    data.directions.push(data.directions.shift())
    return moves;
}

function consider() {
    data.elves.forEach(elf => {
        let map = [];

        for (let y = elf.position[1] - 1; y <= elf.position[1] + 1; y++) {
            for (let x = elf.position[0] - 1; x <= elf.position[0] + 1; x++) {
                if (x != elf.position[0] || y != elf.position[1]) {
                    map.push(data.elves.findIndex(e => e.position[0] == x && e.position[1] == y) > -1)
                }
            }
        }

        elf.proposal = null;

        if (map.filter(m => m).length > 0) {
            data.directions.forEach(d => {
                if (elf.proposal == null) {
                    propose(elf, map, d);
                }
            })
        }
    })

}

function propose(elf, map, direction) {
    if (direction == 'N') {
        if (!map[0] && !map[1] && !map[2]) elf.proposal = [elf.position[0], elf.position[1] - 1];
    }
    else if (direction == 'S') {
        if (!map[5] && !map[6] && !map[7]) elf.proposal = [elf.position[0], elf.position[1] + 1];
    }
    else if (direction == 'W') {
        if (!map[0] && !map[3] && !map[5]) elf.proposal = [elf.position[0] - 1, elf.position[1]];
    }
    else if (direction == 'E') {
        if (!map[2] && !map[4] && !map[7]) elf.proposal = [elf.position[0] + 1, elf.position[1]];
    }
}

function move() {
    let moves = 0;
    data.elves.filter(elf => elf.proposal != null).forEach(elf => {
        let proposalCount = data.elves.filter(e => e.proposal != null && e.proposal[0] == elf.proposal[0] && e.proposal[1] == elf.proposal[1]).length;

        if (proposalCount == 1) {
            elf.position[0] = elf.proposal[0];
            elf.position[1] = elf.proposal[1];
            moves++;
        }
    });
    return moves;
}

function showGrid() {
    let mx = getMinMax();

    for (let y = mx.minY; y <= mx.maxY; y++) {
        let row = '';
        for (let x = mx.minX; x <= mx.maxX; x++) {
            if (data.elves.findIndex(e => e.position[0] == x && e.position[1] == y) > -1)
                row += '#'
            else
                row += '.'
        }
        //console.log(row);
    }

    let empty = (mx.maxX - mx.minX + 1) * (mx.maxY - mx.minY + 1)

    console.log(empty, empty-data.elves.length);
}

function getMinMax() {
    let minX = data.elves[0].position[0];
    let maxX = data.elves[0].position[0];
    let minY = data.elves[0].position[1];
    let maxY = data.elves[0].position[1];

    data.elves.forEach(elf => {
        if (elf.position[0] < minX) minX = elf.position[0];
        if (elf.position[0] > maxX) maxX = elf.position[0];
        if (elf.position[1] < minY) minY = elf.position[1];
        if (elf.position[1] > maxY) maxY = elf.position[1];
    })
    return { minX, maxX, minY, maxY }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    data.input = [];
    data.elves = [];

    arr.forEach((line, y) => {
        for (let x = 0; x < line.length; x++) {
            if (line[x] == '#') {
                data.elves.push({ position: [x+100, y+100], proposal: null });
            }
        }
    });

    console.log(data.elves)

    data.directions = ['N', 'S', 'W', 'E']
}