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
    console.log(JSON.stringify(data, null, 2));
    part1(data);

    part2(data.map(d => d.line));
});

function part1(data) {
    console.log(`Processing Part 1`)
    let visible = 0;

    data.forEach((entry,i) => {
        let row = entry.line;

        if (i == 0 || i == row.length - 1) {
            visible += row.length;
        }
        else {
            visible += 2;
            for (let j = 1;j<row.length - 1;j++) {
                let t = row[j];

                // left
                let lv = true;

                for (let c=0;c<j;c++) {
                    if (row[c]>=t) {
                        lv = false;
                        break;
                    }
                }

                // right
                let rv = true;

                for (let c=j+1;c<row.length;c++) {
                    if (row[c]>=t) {
                        rv = false;
                        break;
                    }
                }

                // top
                let tv = true;

                for (let r=0;r<i;r++) {
                    if (data[r].line[j]>=t) {
                        tv = false;
                        break;
                    }
                }

                let bv = true;

                for (let r=i+1;r<data.length;r++) {
                    if (data[r].line[j]>=t) {
                        bv = false;
                        break;
                    }
                }

                if (lv || rv || tv || bv) {
                    visible++;
                }
            }
        }

    });

    console.log(`There are ${visible} trees visible`);
}

function part2(data) {
    console.log(`Processing Part 2`)
    let scenicScore = 0;

    data.forEach((row,i) => {
        if (i > 0 &&  i < row.length - 1) {
            for (let j = 0;j<row.length;j++) {

                let t = row[j];

                // left
                let ls = 0;

                if (j > 0 && row[j-1]<t) {
                    for (let c=j-1;c>=0;c--) {
                        ls++;
                        if (row[c]>=t) break;
                    }
                }

                // right
                let rs = 0;

                if (j < row.length && row[j+1]<t) {
                    for (let c=j+1;c<row.length;c++) {
                        rs++;
                        if (row[c]>=t) break;
                    }
                }

                // up
                let us = 0;

                if (i > 1) {
                    for (let r=i-1;r>=0;r--) {
                        us++;
                        if (data[r][j]>=t) break;
                    }
                }

                // down/bottom
                let ds = 0;

                if (i < data.length - 1) {
                    for (let r=i+1;r<data.length;r++) {
                        ds++;
                        if (data[r][j]>=t) break;
                    }
                }

                let score = ls * rs * us * ds;

                if (score > scenicScore) {
                    console.log(i,j,t,ls,rs,us,ds,score)
                    scenicScore = score;
                }
            }
        }

    });

    console.log(`The best scenic score is ${scenicScore}`);
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    const data = [];

    arr.forEach((line,i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.push({line, index:i})
        }   
    });

    return data;
}