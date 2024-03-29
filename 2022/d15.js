const fs = require('fs');
const { reduce } = require('underscore');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';


fs.readFile(file, function(err, input) {
    if (err) throw err;

    let data = parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1(data, 10);

    part2(data);
});

function part1(data, r) {
    console.log(`Processing Part 1`)
    let mm = getMinMax(data.sensors, 0)
    const minX = mm.min;
    const maxX = mm.max;
    mm = getMinMax(data.sensors, 1);
    const minY = mm.min;
    const maxY = mm.max;

    console.log(minX, minY, maxX, maxY)

    data.grid = [];
    data.blanks = {}

    let r1 = r - minY;
    let r1count = 0;

    //data.sensors.filter(s => s.sensor[0]==8 && s.sensor[1]==7).forEach(s => {
    data.sensors.forEach(s => {
        console.log('part 0', s)

        for (let y = s.sensor[1] - s.distance; y <= s.sensor[1] + s.distance; y++) {
            if (y == r) {
                for (let x = s.sensor[0] - s.distance; x <= s.sensor[0] + s.distance; x++) {
                    if (getRectilinearDistance([x, y], s.sensor) <= s.distance) {
                        if (data.sensors.findIndex(s => s.sensor[0] == x && s.sensor[1] == y || s.beacon[0] == x && s.beacon[1] == y) == -1) {
                            if (data.blanks[y] == null) {
                                data.blanks[y] = [];
                            }
                            if (data.blanks[y][x] == null) {
                                data.blanks[y][x] = 1;
                                if (y == r1) r1count++;
                            }
                        }
                    }
                }
            }
        }
    });

    console.log(r1, r1count)

    //console.log(data.blanks);

    for (let y = 0; y < r; y++) {
        let line = [];

        for (let x = minX; x < maxX; x++) {
            if (data.sensors.findIndex(s => s.sensor[0] == x && s.sensor[1] == y) > -1) {
                line.push('S');
            }
            else if (data.sensors.findIndex(s => s.beacon[0] == x && s.beacon[1] == y) > -1) {
                line.push('B');
            }
            else if (data.blanks[y] != null && data.blanks[y][x] == 1) {
                line.push('#');
            }
            else {
                line.push('.');
            }
        }
        data.grid.push(line.join(''))
    }

    console.log(data.sensors);
    //console.log(data.grid)
    //data.grid.forEach((l,i) => {
    //    console.log(l, i+minY);
    //});
    //console.log(data.grid[10 - minY], data.grid[10 - minY].split('').filter(x => x == '#').length)
    if (data.grid.length > 2000000) {
        console.log(data.grid[2000000 - minY], data.grid[2000000 - minY].split('').filter(x => x == '#').length)
    }
}

function part2(data) {
    console.log(`Processing Part 2`)

    let mm = getMinMax(data.sensors, 0)
    const minX = mm.min;
    const maxX = mm.max;
    mm = getMinMax(data.sensors, 1);
    const minY = mm.min;
    const maxY = mm.max;

    console.log(minX, minY, maxX, maxY)

    for (let y = 0; y < 4000000; y++) {
        let range = []
        data.sensors.forEach(s => {
            if (y >= s.sensor[1] - s.distance && y <= s.sensor[1] + s.distance) {
                range.push([s.sensor[0] - s.distance + Math.abs(s.sensor[1] - y), s.sensor[0] + s.distance - Math.abs(s.sensor[1] - y)]);
            }
        })
        let r2 = [];
        let x1 = 0;
        let x2 = 0;

        if (range.length == 0) continue;

        range.sort((a, b) => a[0] - b[0]);
        x1 = range[0][0];
        x2 = range[0][1];

        range.forEach(r => {
            if (r[0] > x2+1) {
                r2.push([x1, x2]);
                console.log(`Beacon at ${x2+1},${y} = ${BigInt(x2+1)*BigInt(4000000)+BigInt(y)}`);
                x1 = r[0];
                x2 = r[1];
            }
            else {
                if (r[1] > x2) {
                    x2 = r[1]
                }
            }
        })
        r2.push([x1, x2])
        if (r2.length>1) {
            console.log(y, range, r2);
        }
        //console.log(y,range,'r2',r2)
    }
}

function getMinMax(sensors, o) {

    let min = 1000000;
    let max = -1000000;

    sensors.forEach(s => {
        let d = o == 0 ? s.dx : s.dy;

        if (s.sensor[o] - d < min) {
            min = s.sensor[0] - d;
        }
        if (s.beacon[o] < min) {
            min = s.beacon[o]
        }
        if (s.sensor[o] + d > max) {
            max = s.sensor[0] + d;
        }
        if (s.beacon[o] > max) {
            max = s.beacon[o]
        }
    });
    return { min: min, max: max }
}

function getDistance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

function getRectilinearDistance(p1, p2) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = {};
    data.sensors = []

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            let l = line.split(' ');
            let s = {
                sensor: [l[2].split('=')[1].split(',')[0] * 1, l[3].split('=')[1].split(':')[0] * 1],
                beacon: [l[8].split('=')[1].split(',')[0] * 1, l[9].split(',')[0].split('=')[1] * 1]
            }
            s.dx = Math.abs(s.sensor[0] - s.beacon[0]);
            s.dy = Math.abs(s.sensor[1] - s.beacon[1]);
            s.distance = getRectilinearDistance(s.sensor, s.beacon);
            s.box = { l1: [s.sensor[0] - s.distance, s.sensor[1]], l2: [s.sensor[0], s.sensor[1] - s.distance], l3: [s.sensor[0] + s.distance, s.sensor[1]], l4: [s.sensor[0], s.sensor[1] + s.distance] }

            data.sensors.push(s);
        }
    });

    return data;
}