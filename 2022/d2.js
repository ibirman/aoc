const fs = require('fs');

const shape = [];

shape.push({ code: 'A',name: 'Rock', score: 1});
shape.push({ code: 'B',name: 'Paper', score: 2});
shape.push({ code: 'C',name: 'Scissors', score: 3});
shape.push({ code: 'X',name: 'Rock', score: 1});
shape.push({ code: 'Y',name: 'Paper', score: 2});
shape.push({ code: 'Z',name: 'Scissors', score: 3});

fs.readFile('d2a.txt', function(err, data) {
    if(err) throw err;

    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    console.log(shape);

    part1(arr);
    part2(arr);

});

function part1(arr) {
    const play=[];

    let total_o = 0;
    let total_y = 0;

    for (const element of arr) {
        let o = shape.find(s => s.code == element[0]);
        let y = shape.find(s => s.code == element[2]);

        let winner = getWinner(o, y);

        if (o == undefined || y == undefined) {
            console.log(o,y);
        }

        total_o += o.score;
        total_y += y.score;

        if (winner.code == o.code) {
            total_o += 6;
        }
        else if (winner.code == y.code) {
            total_y += 6;
        }
        else {
            total_o += 3;
            total_y += 3;
        }

        play.push({ o, y, winner})
    }

    console.log('Total O', total_o, 'Total Y', total_y);
}

function part2(arr) {
    const play=[];

    let total_o = 0;
    let total_y = 0;

    for (const element of arr) {
        let o = shape.find(s => s.code == element[0]);
        let y = shape.find(s => s.code == element[2]);

        if (y.code == 'X') {
            if (o.code == 'A') y = shape.find(s => s.code == 'C');
            if (o.code == 'B') y = shape.find(s => s.code == 'A');
            if (o.code == 'C') y = shape.find(s => s.code == 'B');
        }
        else if (y.code == 'Y') {
            y = shape.find(s => s.code == o.code);
        }
        else if (y.code == 'Z') {
            if (o.code == 'A') y = shape.find(s => s.code == 'B');
            if (o.code == 'B') y = shape.find(s => s.code == 'C');
            if (o.code == 'C') y = shape.find(s => s.code == 'A');
        }

        let winner = getWinner(o, y);

        total_o += o.score;
        total_y += y.score;

        if (winner.code == o.code) {
            total_o += 6;
        }
        else if (winner.code == y.code) {
            total_y += 6;
        }
        else {
            total_o += 3;
            total_y += 3;
        }

        play.push({ o, y, winner})
    }

    console.log(play, 'Total O', total_o, 'Total Y', total_y);
}

function getWinner(s1, s2) {
    if (s1.name == s2.name) return {};
    if (s1.name == 'Rock' && s2.name == 'Scissors') return s1;
    if (s1.name == 'Rock' && s2.name == 'Paper') return s2;
    if (s1.name == 'Paper' && s2.name == 'Rock') return s1;
    if (s1.name == 'Paper' && s2.name == 'Scissors') return s2;
    if (s1.name == 'Scissors' && s2.name == 'Rock') return s2;
    if (s1.name == 'Scissors' && s2.name == 'Paper') return s1;
}