const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

let data = {};
const rocks = [['@@@@'], ['.@.', '@@@', '.@.'], ['..@', '..@', '@@@'], ['@', '@', '@', '@'], ['@@', '@@']];

fs.readFile(file, function(err, input) {
    if (err) throw err;

    data = parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    console.log(rocks)
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    data.rocks = rocks;
    data.turn = 0;
    data.jet = 0;

    let repeat = data.jets.length * rocks.length;

    console.log(`Pattern should repeat every ${repeat} turns`)

    for (data.turn = 0; data.turn <= repeat*10; data.turn++) {
        if (data.moves >= data.jets.length) {
            console.log(data.turn, data.moves, data.jets.length)
        }
        nextRock();

        let moveOk = true;
        data.move = 0;

        while (moveOk) {
            moveRightLeft();
            moveOk = moveDown();
        }
        if (data.turn%repeat == 0) {
            showChamber(data.chamber);
        }
    
    }

    //showChamber(data.chamber);
}

function part2() {
    console.log(`Processing Part 2`)
}

function nextRock() {
    let empty = 0;

    for (let i = data.chamber.length - 1; i > 0; i--) {
        if (data.chamber[i] == '.......') {
            empty++;
        }
    }

    if (empty > 0) {
        for (let i = 0; i < empty; i++) {
            data.chamber.pop();
        }
    }

    let rock = data.rocks[data.turn % 5]

    data.chamber.push('.'.repeat(7));
    data.chamber.push('.'.repeat(7));
    data.chamber.push('.'.repeat(7));

    for (let j = rock.length; j > 0; j--) {
        data.chamber.push(('..' + rock[j - 1] + '.......').substring(0, 7));
    }

    //console.log(data.turn)
    //showChamber(data.chamber);
}

function moveRightLeft() {
    let move = data.jets[data.jet % data.jets.length];
    data.jet++;
    data.moves++;

    let moveOk = true;

    let b = findBottom(data.chamber);

    for (let i = data.chamber.length - 1; i >= b; i--) {
        if (move == '>') {
            moveOk = !checkRockRight(data.chamber, i) ? false : moveOk;
        }
        else {
            moveOk = !checkRockLeft(data.chamber, i) ? false : moveOk;
        }
    }

    if (moveOk) {
        for (let i = data.chamber.length - 1; i >= b; i--) {
            if (move == '>') {
                data.chamber[i] = data.chamber[i].replace(/([^@]*)(\@+)\.(.*)/, "$1.$2$3");
            }
            else {
                data.chamber[i] = data.chamber[i].replace(/(.*)\.(\@+)([^@]*)/, "$1$2.$3".substring(0, 7));
            }
        }
    }
}

function moveDown() {
    data.bottom = 0;
    data.bottom = findBottom(data.chamber);

    let moveOk = true;

    moveOk = checkRockDown(data.chamber, data.bottom);

    if (moveOk) {
        moveRockDown();
    }
    else {
        placeRock();
    }

    return moveOk;

}

function checkRockDown(chamber) {
    let moveOk = true;

    for (let i = data.bottom; i < chamber.length; i++) {
        for (let j = 0; j < chamber[data.bottom].length; j++) {
            if (chamber[i][j] == '@' && chamber[i - 1][j] == '#') {
                moveOk = false;
            }
        }
    }

    return moveOk;
}

function moveRockDown() {
    let chamber = data.chamber;

    for (let i = data.bottom; i < chamber.length; i++) {
        for (let j = 0; j < chamber[data.bottom].length; j++) {
            if (chamber[i][j] == '@') {
                chamber[i] = setCharAt(chamber[i], j, '.');
                chamber[i - 1] = setCharAt(chamber[i - 1], j, '@');
            }
        }
    }
    data.bottom++;
}

function placeRock() {
    let chamber = data.chamber;

    for (let i = 0; i < chamber.length; i++) {
        chamber[i] = chamber[i].replace(/\@/g, '#');
    }
}

function checkRockLeft(chamber, i) {
    let moveOk = true;

    let rockRowLeft = chamber[i].indexOf('@')

    if (rockRowLeft > -1) {
        if (rockRowLeft == 0 || chamber[i][rockRowLeft - 1] != '.') {
            moveOk = false;
        }
    }

    return moveOk;
}

function checkRockRight(chamber, i) {
    let moveOk = true;
    let rockRowRight = 6 - chamber[i].split('').reverse().join('').indexOf('@')

    if (rockRowRight <= 6) {
        if (rockRowRight == 6 || chamber[i][rockRowRight + 1] != '.') {
            moveOk = false;
        }
    }

    return moveOk
}

function findBottom(chamber) {
    let top = 0;

    for (let i = chamber.length - 1; i > 0; i--) {
        if (i >= 0 && chamber[i].indexOf('@') > -1) {
            top = i;
            break;
        }
    }

    let bottom = top;

    for (let i = top - 1; i > top - 5; i--) {
        if (i >= 0 && chamber[i].indexOf('@') > -1) {
            bottom = i;
        }
    }

    return bottom;
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = {};
    data.chamber = ['#######']

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.jets = line;
            data.moves = 0;
        }
    });

    return data;
}

function showChamber(chamber) {
    console.log(chamber.length)
    chamber.slice().reverse().filter((c,i) => i< 30).map(c => console.log(c))

    let h = data.chamber.filter(c => c.indexOf('#') > -1).length
    console.log(`Total stack height is ${h-1}`)
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}