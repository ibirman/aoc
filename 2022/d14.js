const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';

fs.readFile(file, function(err, input) {
    if (err) throw err;

    let data = parseInput(input);
    //console.log(JSON.stringify(data, null, 2));
    part1(data);

    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`)

    let grid = drawGrid(data);
    fillGrid(data, grid);

    let start = { x: 500, y: 0 }

    grid.map.forEach(l => console.log(l))

    while (grid.full == false) {
        drop(start, grid);
        //console.log(grid.map)
    }

    console.log(grid);
}

function part2(data) {
    console.log(`Processing Part 2`)

    let grid = drawGrid(data);

    grid.map = [];
    grid.x1 = 0;
    grid.x2 = 1000;

    for (let y = grid.y1; y < grid.y2; y++) {
        grid.map.push('.'.repeat(grid.x2 - grid.x1))
    }

    fillGrid(data, grid);

    grid.y2+=2;
    grid.map.push('.'.repeat(grid.x2 - grid.x1))
    grid.map.push('#'.repeat(grid.x2 - grid.x1))

    let start = { x: 500, y: 0 }

    grid.map.forEach(l => console.log(l))

    while (grid.full == false && grid.map[start.y][start.x] == '.') {
        drop(start, grid);
        //console.log(grid.map)
    }

    console.log(grid);
}

function drawGrid(data) {
    let grid = { x1: 0, x2: 0, y1: 0, y2: 0, map: [], full: false, count: 0 }

    data.forEach(line => {
        let y2 = line.map(d => d[1]).sort((a, b) => a - b).reverse()[0] + 1;
        let x1 = line.map(d => d[0]).sort((a, b) => a - b)[0] - 1;
        let x2 = line.map(d => d[0]).sort((a, b) => a - b).reverse()[0] + 1;
        if (grid.x1 == 0 || grid.x1 > x1) grid.x1 = x1;
        if (grid.x2 == 0 || grid.x2 < x2) grid.x2 = x2;
        if (grid.y2 == 0 || grid.y2 < y2) grid.y2 = y2;
    });

    for (let y = grid.y1; y < grid.y2; y++) {
        grid.map.push('.'.repeat(grid.x2 - grid.x1))
    }

    return grid;
}

function fillGrid(data, grid) {
    data.forEach(line => {
        line.forEach((p, i) => {
            if (i > 0) {
                let q = line[i - 1]
                let x1 = 0;
                let x2 = 0;
                let y1 = 0;
                let y2 = 0;
                if (q[0] > p[0]) {
                    x2 = q[0];
                    x1 = p[0];
                }
                else {
                    x2 = p[0];
                    x1 = q[0];
                }
                if (q[1] > p[1]) {
                    y2 = q[1];
                    y1 = p[1];
                }
                else {
                    y2 = p[1];
                    y1 = q[1];
                }
                for (let j = x1; j <= x2; j++) {
                    for (let k = y1; k <= y2; k++) {
                        grid.map[k] = setCharAt(grid.map[k], j - grid.x1, '#');
                    }
                }
            }
        })
    })
}

function drop(start, grid) {
    let x = start.x - grid.x1;
    let y = grid.y1;
    let dropped = false;

    while (y < grid.y2 - 1 && !dropped) {
        if (grid.map[y + 1][x] == '.') {
            y++;
        }
        else if (x > 0 && grid.map[y + 1][x - 1] == '.') {
            x--;
            y++;
        }
        else if (x < (grid.x2 - grid.x1) && grid.map[y + 1][x + 1] == '.') {
            x++;
            y++;
        }
        else {
            grid.map[y] = setCharAt(grid.map[y], x, 'o')
            grid.count++;
            dropped = true;
        }
    }
    if (y == grid.y2 - 1) {
        grid.full = true;
    }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.push(line.split(' -> ').map(p => p.split(',').map(n => n * 1)))
        }
    });

    return data;
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}