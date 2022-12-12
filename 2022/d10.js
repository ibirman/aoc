const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/,'.txt')
const file = argv._[0] ?? defaultDataFile;
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
    console.log(data);

    let x = 1;
    let cycle = 1;
    const rows = [];
    rows.push({row:''})

    const cycles = [];

    data.forEach(op => {
        if (op.opcode == 'addx') {
            processCycle(cycle++, x, cycles, rows);
            processCycle(cycle++, x, cycles, rows);
            x+=op.V;
        }
        else if (op.opcode == 'noop') {
            processCycle(cycle++, x, cycles, rows);
        }
    });

    console.log(`The value of X is ${x}`)

    let total = 0;
    cycles.forEach(c => {
        total += c.cycle * c.x;
    })

    console.log(`The sum of the signal strengths is ${total}`)
}


function part2(data) {
    console.log(`Processing Part 2`)
    console.log(data);

    let x = 1;
    let cycle = 1;
    const rows = [];
    const cycles = [];
    rows.push({row:''})

    data.forEach(op => {
        if (op.opcode == 'addx') {
            processCycle(cycle++, x, cycles, rows);
            processCycle(cycle++, x, cycles, rows);
            x+=op.V;
        }
        else if (op.opcode == 'noop') {
            processCycle(cycle++, x, cycles, rows);
        }
    });

    console.log(`The value of X is ${x}`)

    console.log(rows);
}

function processCycle(cycle, x, cycles, rows) {
    if (cycle == 20 || (cycle - 20) % 40 == 0) {
        console.log(cycle, cycle * x)
        cycles.push({cycle: cycle, x: x});
    }

    let n = rows.length - 1;
    let c = cycle - (40 * n);

    console.log(n, c, x)

    if (c >= x - 0 && c <= x + 2) {
        rows[n].row += '#'
    }
    else {
        rows[n].row += '.'
    }
    
    if (cycle % 40 == 0) {
        rows.push({row:''});
    }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    const data = [];

    arr.forEach((line,i) => {
        if (!(i == arr.length - 1 && line == '')) {
            const op = line.split(' ');
            let o = {opcode: op[0]}
            if (o.opcode != 'noop') {
                o.V = op[1]*1;
            }
            data.push(o)
        }   
    });

    return data;
}