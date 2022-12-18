const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map, object } = require('underscore');

console.log(argv);
const pathLength = 30;

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';


fs.readFile(file, function(err, input) {
    if (err) throw err;

    let data = parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1(data);

    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`)
    data.paths = [];

    let room = { ...data.rooms.find(r => r.name == 'AA') };

    let path = { rooms: [room], moves: [room.name], time: pathLength, totalFlow: 0 }

    data.paths = followPath(data, path)
    data.paths.forEach(p => console.log(p))
}

function part2(data) {
    console.log(`Processing Part 2`)
}

function followPath(data, path) {
    if (path.time <= 0) return completePath(data, path) ? [path] : [];

    let room = path.rooms[path.rooms.length - 1];

    if (room.tunnels.length == 1) {
        room.skip = true;
    }

    openValve(path, room)

    if (path.time <= 0) return completePath(data, path) ? [path] : [];

    let paths = [];

    room.tunnels.forEach(tunnel => {
        let nextRoom = JSON.parse(JSON.stringify(data.rooms.find(r => r.name == tunnel)));

        if (!nextRoom.skip) {
            let nextPath = JSON.parse(JSON.stringify(path))
            nextPath.time--;

            releasePressure(nextPath);

            if (nextPath.rooms.indexOf(r => r.name == nextRoom.name) == -1) {
                nextPath.rooms.push(nextRoom)
            }
            nextPath.moves.push(nextRoom.name);
            //console.log(nextRoom.name, nextPath.time, nextPath.rooms.length)
            paths.push(...followPath(data, nextPath))
        }
    })

    return paths;
}

function completePath(data, path) {
    if (path.time <= 0) {
        if (path.totalFlow > data.bestTotalFlow) {
            data.bestTotalFlow = path.totalFlow;
            console.log(path)
            return true
        }
        else {
            return false
        }
    }
}

function releasePressure(path) {
    path.rooms.filter(r => r.valve.open).forEach(r => {
        r.totalFlow += r.valve.flowRate;
        path.totalFlow += r.valve.flowRate;
    });
}

function openValve(path, room) {
    releasePressure(path);

    if (!room.valve.open && room.valve.flowRate > 0) {
        room.valve.open = true;
        path.time--;
    }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = { rooms: [], bestTotalFlow: -1 };

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            let room = { tunnels: [], valve: { open: false }, skip: false, totalFlow: 0 };

            line.split(' ').forEach((l, i) => {
                if (i == 1) {
                    room.name = l;
                }
                else if (i == 4) {
                    room.valve.flowRate = l.split('=')[1].replace(/;/, '') * 1;
                }
                else if (i > 8) {
                    room.tunnels.push(l.replace(/,/, ''));
                }
            });

            data.rooms.push(room)
        }
    });

    return data;
}