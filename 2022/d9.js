const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');
const { getEnvironmentData } = require('worker_threads');

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
    let maxX = 0;
    let maxY = 0;
    let minX = 0;
    let minY = 0;

    const grid = [];
    const hits = [];
    const rope = { H: { x: 0, y: 0 }, T: { x: 0, y: 0 } };

    console.log(rope);

    data.forEach(move => {
        let d = move.distance;
        for (let i = 0; i < d; i++) {
            if (move.direction == 'R') rope.H.x++;
            if (move.direction == 'L') rope.H.x--;
            if (move.direction == 'D') rope.H.y++;
            if (move.direction == 'U') rope.H.y--;

            if (rope.T.x - rope.H.x > 1) {
                rope.T.x--;
                rope.T.y = rope.H.y;
            }
            if (rope.T.x - rope.H.x < -1) {
                rope.T.x++;
                rope.T.y = rope.H.y;
            }
            if (rope.T.y - rope.H.y > 1) {
                rope.T.y--;
                rope.T.x = rope.H.x;
            }
            if (rope.T.y - rope.H.y < -1) {
                rope.T.y++;
                rope.T.x = rope.H.x;
            }
            if (hits.findIndex(h => h.x == rope.T.x && h.y == rope.T.y) == -1) {
                hits.push({ x: rope.T.x, y: rope.T.y });
            }
        }
        if (rope.T.y < minY) minY = rope.T.y;
        if (rope.T.y > maxY) maxY = rope.T.y;
        if (rope.T.x < minX) minX = rope.T.x;
        if (rope.T.x > maxX) maxX = rope.T.x;
        //console.log(move, position);
    });

    //console.log(data, position, hits, hits.length)

    for (let i = minY; i <= maxY; i++) {
        let row = '';
        for (let j = minX; j <= maxX; j++) {
            if (i == 0 && j == 0) {
                row += 's';
            }
            else if (hits.findIndex(h => h.x == j && h.y == i) == -1) {
                row += '.';
            }
            else {
                row += '#';
            }
        }
        grid.push(row);
    }

    grid.forEach(row => {
        console.log(row);
    });

    console.log(`There are ${hits.length} positions visited at least once`)
}

function part2(data) {
    console.log(`Processing Part 2`)

    let hits = [];

    const rope = [];
    rope.push({ knot: 'H', x: 0, y: 0 });

    for (let i = 1; i <= 9; i++) {
        rope.push({ knot: i + '', x: 0, y: 0 });
    }

    console.log(rope);

    data.forEach(move => {
        let d = move.distance;
        for (let i = 0; i < d; i++) {
            if (move.direction == 'R') rope[0].x++;
            if (move.direction == 'L') rope[0].x--;
            if (move.direction == 'D') rope[0].y++;
            if (move.direction == 'U') rope[0].y--;

            for (let j = 1; j <= 9; j++) {
                //console.log(move, d, j)
                let k = j - 1;
                if (Math.abs(rope[j].x - rope[k].x) > 1 && Math.abs(rope[j].y - rope[k].y) > 1) {
                    rope[j].x += (rope[k].x - rope[j].x) / 2;
                    rope[j].y += (rope[k].y - rope[j].y) / 2;
                }
                else {
                    if (rope[j].x - rope[k].x > 1) {
                        rope[j].x--;
                        rope[j].y = rope[k].y;
                    }
                    if (rope[j].x - rope[k].x < -1) {
                        rope[j].x++;
                        rope[j].y = rope[k].y;
                    }
                    if (rope[j].y - rope[k].y > 1) {
                        rope[j].y--;
                        rope[j].x = rope[k].x;
                    }
                    if (rope[j].y - rope[k].y < -1) {
                        rope[j].y++;
                        rope[j].x = rope[k].x;
                    }
                }

                if (j == 9) {
                    saveKnot(hits, rope[j]);
                }
            }
        }
    });

    drawRope(rope);
    drawGrid(hits);

    console.log(`There are ${hits.length} positions visited at least once`)
}

function saveKnot(hits, knot) {
    let h = hits.findIndex(h => h.x == knot.x && h.y == knot.y);

    if (h < 0) {
        console.log(knot,h )
        hits.push({ knot: knot.knot, x: knot.x, y: knot.y });
    }
    else {
        hits[h].knot = knot.knot;
    }
}

function drawGrid(hits) {
    console.log(hits);
    let maxX = 0;
    let maxY = 0;
    let minX = 0;
    let minY = 0;

    hits.forEach(hit => {
        if (hit.y > maxY) maxY = hit.y;
        if (hit.y < minY) minY = hit.y;
        if (hit.x > maxX) maxX = hit.x;
        if (hit.x < minX) minX = hit.x;
    });

    const grid = [];

    for (let i = minY; i <= maxY; i++) {
        let row = '';
        for (let j = minX; j <= maxX; j++) {
            if (i == 0 && j == 0) {
                row += 's';
            }
            else if (hits.findIndex(h => h.x == j && h.y == i) == -1) {
                row += '.';
            }
            else {
                row += hits.find(h => h.x == j && h.y == i).knot;
            }
        }
        grid.push(row);
    }

    grid.forEach(row => {
        console.log(row);
    });
}

function drawRope(rope) {
    let maxX = 0;
    let maxY = 0;
    let minX = 0;
    let minY = 0;

    rope.forEach(knot => {
        if (knot.y - 2 < minY) minY = knot.y - 2;
        if (knot.y + 2 > maxY) maxY = knot.y + 2;
        if (knot.x - 2 < minX) minX = knot.x - 2;
        if (knot.x + 2 > maxX) maxX = knot.x + 2;
    });

    const grid = [];

    for (let i = minY; i <= maxY; i++) {
        let row = '';
        for (let j = minX; j <= maxX; j++) {
            if (i == 0 && j == 0) {
                row += 's';
            }
            else {
                const k = rope.find(r => r.x == j && r.y == i);

                if (k == null) {
                    row += '.';
                }
                else {
                    row += k.knot;
                }
            }
        }
        grid.push(row);
    }

    console.log('Grid:')
    grid.forEach(row => {
        console.log(row);
    });
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            const row = line.split(' ');
            data.push({ direction: row[0], distance: row[1] * 1 })
        }
    });

    return data;
}