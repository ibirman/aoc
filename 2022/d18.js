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
    console.log(data);
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    let openSides = 0;

    data.cubes.forEach((c, i) => {
        openSides += countOpenFaces(c, i);
    })

    console.log(`There are ${openSides} faces with no connections`)
}

function part2() {
    console.log(`Processing Part 2`)
    let openFaces = 0;

    data.cubes.forEach((c, i) => {
        openFaces += countOpenFaces(c, i);
    })

    for (let b = 0; b < 4; b++) {
        data.interior = [];
        //data.unblocked = [];
        // for every xyz
        for (let z = data.minMax[2][0]; z <= data.minMax[2][1]; z++) {
            for (let y = data.minMax[1][0]; y <= data.minMax[1][1]; y++) {
                for (let x = data.minMax[0][0]; x <= data.minMax[2][1]; x++) {
                    // if the space is empty
                    if (data.cubes.findIndex(c => c[0] == x && c[1] == y && c[2] == z) == -1) {
                        // if it's not already in the list of unblocked spaces
                        if (data.unblocked.findIndex(d => d[0] == x && d[1] == y && d[2] == z) == -1) {
                            if (!exitBlocked([x, y, z])) {
                                data.unblocked.push([x, y, z])
                            }
                            else {
                                data.interior.push([x,y,z])
                            }
                        }
                    }
                }
            }
        }
        console.log(data.unblocked.length)
        //showCube()
    }

    data.blockedFaces = 0;

    data.interior.forEach(o => {
        let p = getConnections(o, -1);
        data.blockedFaces += p.length;
    })

    //console.log(data.unblocked)
    showCube();
    console.log(data.minMax)
    console.log(`There are ${openFaces} exposed faces`)
    console.log(`There are ${openFaces - data.blockedFaces} exposed faces that have an exit`)

    let openSides = 0;
    data.interior.forEach(o => {
        if (data.cubes.findIndex(c => c[0] == o[0] && c[1] == o[1] && c[2] == o[2]) == -1)
            data.cubes.push(o)
    });

    data.cubes.forEach((c, i) => {
        openSides += countOpenFaces(c, i);
    })

    console.log(`There are ${openSides} faces with no connections`)

}

function showCube() {
    let cube = [];
    for (let z = data.minMax[2][0]; z <= data.minMax[2][1]; z++) {
        let yl = [];
        for (let y = data.minMax[1][0]; y <= data.minMax[1][1]; y++) {
            let xl = []
            for (let x = data.minMax[0][0]; x <= data.minMax[0][1]; x++) {
                let p = '.';
                if (data.cubes.findIndex(c => c[0] == x && c[1] == y && c[2] == z) > -1) {
                    p = '#'
                }
                if (data.unblocked.findIndex(c => c[0] == x && c[1] == y && c[2] == z) > -1) {
                    if (p == '.') p = ' ';
                    else (p = '?');
                }
                if (data.interior.findIndex(c => c[0] == x && c[1] == y && c[2] == z) > -1) {
                    if (p == '.') p = 'X';
                    else (p = '?');
                }
                xl.push(p);
            }
            yl.push(xl);
        }
        cube.push(yl);
    }
    console.log(`Printing Cube`)
    cube.forEach((yl,z) => {
        console.log(z, '------')
        yl.forEach((xl,y) => console.log(xl.join(''), y))
    });
}

function countOpenFaces(c, i) {
    return getOpenFaces(c, getConnections(c, i)).length;
}

function getConnections(c, i) {
    let connections = data.cubes.filter((d, j) => {
        if (j == i) return false;

        if ((d[0] == c[0] ? 1 : 0) + (d[1] == c[1] ? 1 : 0) + (d[2] == c[2] ? 1 : 0) == 2) {
            if (Math.abs(d[0] - c[0] - d[1] + c[1] - d[2] + c[2]) == 1) return true;
        }
    });

    return connections;
}

function getOpenFaces(cube, connections) {
    let openFaces = [];

    if (connections.findIndex(c => c[0] == cube[0] + 1) == -1) openFaces.push([cube[0] + 1, cube[1], cube[2]])
    if (connections.findIndex(c => c[0] == cube[0] - 1) == -1) openFaces.push([cube[0] - 1, cube[1], cube[2]])
    if (connections.findIndex(c => c[1] == cube[1] + 1) == -1) openFaces.push([cube[0], cube[1] + 1, cube[2]])
    if (connections.findIndex(c => c[1] == cube[1] - 1) == -1) openFaces.push([cube[0], cube[1] - 1, cube[2]])
    if (connections.findIndex(c => c[2] == cube[2] + 1) == -1) openFaces.push([cube[0], cube[1], cube[2] + 1])
    if (connections.findIndex(c => c[2] == cube[2] - 1) == -1) openFaces.push([cube[0], cube[1], cube[2] - 1])

    return openFaces;
}

function exitBlocked(c) {
    let blocked = true;

    let d = getOpenFaces(c, getConnections(c, -1))

    d.forEach(e => {
        if (data.unblocked.findIndex(o => o[0] == e[0] && o[1] == e[1] && o[2] == e[2]) > -1) {
            blocked = false;
        }
        else {
            if (e[0] == data.minMax[0][0] || e[0] == data.minMax[0][1] ||
                e[1] == data.minMax[1][0] || e[1] == data.minMax[1][1] ||
                e[2] == data.minMax[2][0] || e[2] == data.minMax[2][1]) {
                blocked = false;
            }
        }
    })

    if (!blocked && data.unblocked.findIndex(o => o[0] == c[0] && o[1] == c[1] && o[2] == c[2]) == -1) {
        data.unblocked.push(c);
    }

    return blocked;
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    data.cubes = [];
    data.unblocked = [];
    data.interior = [];
    data.blockedFaces = 0;

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.cubes.push(line.split(',').map(c => c * 1))
        }
    });

    getMinMax();

}

function getMinMax() {
    data.minMax = [[], [], []];

    data.cubes.forEach(c => {
        c.forEach((d, i) => {
            if (data.minMax[i].length == 0) {
                data.minMax[i] = [d, d];
            }
            else {
                if (d < data.minMax[i][0]) data.minMax[i][0] = d;
                if (d > data.minMax[i][1]) data.minMax[i][1] = d;
            }
        })
    })
}