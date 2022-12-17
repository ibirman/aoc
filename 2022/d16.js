const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map, object } = require('underscore');

console.log(argv);

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

    let path = { rooms: [room], time: 0, totalFlow: 0 }

    data.paths = followPath(data, path)
    data.paths.forEach(p => console.log(p))
}

function part2(data) {
    console.log(`Processing Part 2`)
}

function followPath(data, path) {
    //console.log(path.rooms.length, path.time, path.totalFlow)
    if (path.time >= 30) {
        if (path.flowRate > data.bestFlowRate) {
            return [path]
        }
        else {
            return []
        }
    }

    let room = path.rooms[path.rooms.length -1];

    openValve(path, room)

    if (path.time >= 30) {
        if (path.totalFlow > data.bestTotalFlow) {
            data.bestTotalFlow = path.totalFlow;
            return [path]
        }
        else {
            return []
        }
    }

    let paths = [];

    room.tunnels.forEach(t => {
        let nextRoom = { ...data.rooms.find(r => r.name == t) };
        let nextPath = JSON.parse(JSON.stringify(path))
        nextPath.time++;
        nextPath.rooms.push(nextRoom)
        //console.log(nextRoom.name, nextPath.time, nextPath.rooms.length)
        paths.push(...followPath(data, nextPath))
    })

    return paths;
}

function openValve(path, room) {
    if (!room.valve.open && room.valve.flowRate > 0) {
        room.valve.open = true;
        path.totalFlow += room.valve.flowRate * (30 - path.time - 1)
        path.time++;
    }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = { rooms: [], paths: [], bestTotalFlow: 0 };

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            let room = { tunnels: [], valve: { open: false } };
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