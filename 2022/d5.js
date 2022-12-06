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
    part1(data);

    data = parseInput(input);
    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`)

    data.parsedMoves = parseMoves(data.moves);
    //console.log(data.stacks);

    data.parsedMoves.forEach(move => {
        for (let i=0;i<move.count;i++) {
            let container = data.stacks[move.from-1].shift();
            data.stacks[move.to-1].unshift(container);
        }
    });

    calculateResultCode(data.stacks);
}

function part2(data) {
    console.log(`Processing Part 2`)

    data.parsedMoves = parseMoves(data.moves);

    data.parsedMoves.forEach(move => {
        let containers = [];
        for (let i=0;i<move.count;i++) {
            containers.push(data.stacks[move.from-1].shift());
        }
        containers.reverse().forEach(container => {
            data.stacks[move.to-1].unshift(container);
        });
    });

    //console.log(data.stacks)

    calculateResultCode(data.stacks);
}

function parseMoves(moves) {
    let parsedMoves = [];
    moves.forEach(move => {
        let matches = move.match(/move (\d+) from (\d+) to (\d+)/);
        parsedMoves.push({
            text: move,
            count: matches[1]*1,
            from: matches[2]*1,
            to: matches[3]*1
        })
    });

    return parsedMoves;
}

function calculateResultCode(stacks) {
    let result = '';
    stacks.forEach(stack => {
        result += stack[0].substring(1,2);
    });
    console.log(`Result code: ${result}`)
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    const data = [];
    data.stacks = [];
    data.moves = [];

    arr.forEach((line,i) => {
        if (line.indexOf('[') > -1) {
            for (let j=0;j<(line.length)/4;j++) {
                let container = line.substring(j*4,j*4+3);

                if (container != '   ') {
                    if (data.stacks[j]==null) {
                        data.stacks[j]=[];
                    }
                    data.stacks[j].push(container);
                }
            }
        }
        else {
            if (line.substring(0,4) == 'move') {
                data.moves.push(line);
            }
        }
    });

    return data;
}