const fs = require('fs');

let lines = fs.readFileSync('./2020q3input.txt', 'utf-8').split('\r\n');

let total = 0;

total = processLines(lines, 1, 1);
total *= processLines(lines, 3, 1);
total *= processLines(lines, 5, 1);
total *= processLines(lines, 7, 1);
total *= processLines(lines, 1, 2);

console.log(total);

function processLines(lines, right, down) {
    let t=0;
    let r=right;

    lines.map((l,i) => {
        if (i>0 && i%down==0) {
            let data = l;
            let c = l[r];
            //console.log(i,r,c,`${data}${data}`);

            if (c=='#') {
                //console.log(r,c);
                t++;
            }
            r+=right;
            if (r>=l.length) {
                r -= l.length;
            }
        }
    });

    console.log(right, down, t);

    return t;
}