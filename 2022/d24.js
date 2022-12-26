const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};

fs.readFile(file, function(err, input) {
    if (err) throw err;

    parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    let maxTime = 10;
    let time = 0;

    while (time < maxTime) {
        moveBlizzards();
        showMap(time);
        moveElves();
        time++;
    }
}

function moveBlizzards() {
    data.valley.blizzards.forEach(b => {
        if (b.direction == '>') {
            b.col++;
            if (b.col > data.valley.map[0].length - 2) b.col = 1;
        }
        else if (b.direction == '<') {
            b.col--;
            if (b.col < 1) b.col = data.valley.map[0].length - 2;
        }
        else if (b.direction == '^') {
            b.row--;
            if (b.row < 1) b.row = data.valley.map.length - 2
        }
        else if (b.direction == 'v') {
            b.row++;
            if (b.row > data.valley.map.length - 2) b.row = 1;
        }
    });
}

function moveElves() {

}

function showMap(time) {
    console.log(`Time: ${time}`)
    data.valley.map.forEach((r, row) => {
        let line = '';
        r.split('').forEach((c, col) => {
            if (c == '#') line += c;
            else {
                let b = data.valley.blizzards.filter(b => b.row == row && b.col == col);
                if (b.length == 1) line += b[0].direction;
                else if (b.length > 1) line += b.length+''.substring(0,1);
                else line += '.';
            }
        })
        console.log(line);
    })
}

function part2() {
    console.log(`Processing Part 2`)
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    data.valley = {};
    data.valley.map = [];
    data.valley.blizzards = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.valley.map.push(line);
            line.split('').forEach((l, j) => {
                if (l == '>' || l == '<' || l == 'v' || l == '^') {
                    data.valley.blizzards.push({ row: j, col: i, direction: l })
                }
            });
        }
    });
}