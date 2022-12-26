const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');
const { rootCertificates } = require('tls');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};
const facings = ['>', 'v', '<', '^']

fs.readFile(file, function(err, input) {
    if (err) throw err;

    parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    let row = 0;
    let col = data.map[0].indexOf('.');
    let facing = '>'
    data.map[0] = setCharAt(data.map[0], col, facing);

    data.codes.forEach((c, i) => {
        if (c == 'R' || c == 'L') {
            facing = rotate(facing, c);
            data.map[row] = setCharAt(data.map[row], col, facing)
        }
        else {
            let newrc = move(row, col, facing, c)
            row = newrc.row;
            col = newrc.col;
        }
    })
    data.map.forEach(l => console.log(l))
    console.log(row + 1, col + 1, facings.findIndex(f => f == facing), (row + 1) * 1000 + (col + 1) * 4 + facings.findIndex(f => f == facing))
}

function part2() {
    console.log(`Processing Part 2`)
}

function rotate(facing, code) {
    let f = facings.findIndex(i => i == facing);
    if (code == 'L') f--;
    if (code == 'R') f++;
    if (f > facings.length - 1) f = 0;
    if (f < 0) f = facings.length - 1;
    return facings[f];
}

function move(row, col, facing, distance) {
    for (let i = 0; i < distance; i++) {
        if (row == 152 && col == 0) {
            console.log(facing);
        }
        let nextMove = findNextMove(row, col, facing);

        if (data.map[nextMove.row][nextMove.col] == undefined) {
            console.log(row, col, nextMove);
        }
        if (data.map[nextMove.row][nextMove.col].match(/[.>v<^]/)) {
            row = nextMove.row;
            col = nextMove.col;
            data.map[row] = setCharAt(data.map[row], col, facing)
        }
        else {
            break;
        }
    }

    return { row: row, col: col }
}

function findNextMove(row, col, facing) {
    if (facing == '>') {
        col++;

        if (col > data.map[row].length - 1) {
            col = data.map[row].split('').findIndex(c => c.match(/[^ ]/))
        }
    }
    else if (facing == '<') {
        col--;

        if (col < 0 || data.map[row][col] == ' ' || data.map[row][col] == undefined) {
            for (col = data.map[row].length - 1; col > 0; col--) {
                if (data.map[row][col] != ' ' && data.map[row][col] != undefined) break;
            }
        }
    }
    else if (facing == 'v') {
        row++;

        if (row > data.map.length - 1 || data.map[row][col] == ' ' || data.map[row][col] == undefined) {
            for (row = 0; row < data.map.length; row++) {
                if (data.map[row][col] != ' ' && data.map[row][col] != undefined) break;
            }
        }
    }
    else if (facing == '^') {
        row--;

        if (row < 0 || data.map[row][col] == ' ' || data.map[row][col] == undefined) {
            for (row = data.map.length - 1; row > 0; row--) {
                if (data.map[row][col] != ' ' && data.map[row][col] != undefined) break;
            }
        }
    }

    return { row, col }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    data.map = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            if (line.substr(0, 1) == '.' || line.substr(0, 1) == '#' || line.substr(0, 1) == ' ') {
                data.map.push(line);
            }
            else {
                data.codes = [];
                let n = '';

                line.split('').forEach((c, i) => {
                    if (c == 'L' || c == 'R') {
                        if (n != '') {
                            data.codes.push(n * 1);
                            n = '';
                        }
                        data.codes.push(c);
                    }
                    else {
                        n = n + c;
                    }
                })
                if (n != '') data.codes.push(n * 1);
            }
        }
    });

    let e = data.map.length / 3;
    data.faces = [[[0,e][e-1,e+e-1]],[[0,e+e][e-1,e+e+e-1]]]
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}