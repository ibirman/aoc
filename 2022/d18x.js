const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};

fs.readFile(file, function(err, input) {
    if (err) throw err;

    let data = parseInput(input);
    part1(data);
});

function part1(text) {
    const input = text.split("\n")
        .map(x => x.split(','))
        .map(x => x.map(Number))
    //.map(x=>x.map(Number)
    const map = {};
    let score = 0;
    let maxx = 0;
    let maxy = 0;
    let maxz = 0;
    input.forEach(x => {
        let tempscore = 6;
        const thisx = x[0];
        const thisy = x[1];
        const thisz = x[2];
        if (thisx > maxx) maxx = thisx;
        if (thisy > maxy) maxy = thisy;
        if (thisz > maxz) maxz = thisz;
        map[`x${thisx}y${thisy}z${thisz}`] = 1;
        const check1 = `x${thisx + 1}y${thisy}z${thisz}`;
        const check2 = `x${thisx - 1}y${thisy}z${thisz}`;
        const check3 = `x${thisx}y${thisy + 1}z${thisz}`;
        const check4 = `x${thisx}y${thisy - 1}z${thisz}`;
        const check5 = `x${thisx}y${thisy}z${thisz + 1}`;
        const check6 = `x${thisx}y${thisy}z${thisz - 1}`;
        if (map[check1]) tempscore -= 2;
        if (map[check2]) tempscore -= 2;
        if (map[check3]) tempscore -= 2;
        if (map[check4]) tempscore -= 2;
        if (map[check5]) tempscore -= 2;
        if (map[check6]) tempscore -= 2;
        score += tempscore;
    });
    console.log('part1: ', score);
    //Part2
    const done = {};
    let score2 = 0;
    const boxsize = 21;
    const boxorigin = -1;
    part2();
    function part2() {
        let currentpos = Object.keys(map).filter(k => k.startsWith(`x${maxx}`))[0];
        let RE = /x(-?\d+)y(-?\d+)z(-?\d+)/;
        let lavax = -1;
        let lavay = -1;
        let lavaz = -1;
        let start = `x${lavax}y${lavay}z${lavaz}`
        let analyszestack = [];
        analyszestack.push(start);
        while (analyszestack.length) {
            let nextstack = [];
            for (let i = 0; i < analyszestack.length; i++) {
                currentpos = analyszestack[i];
                if (done[currentpos]) continue;
                done[currentpos] = 1;
                let parsed = RE.exec(currentpos);
                lavax = parseInt(parsed[1]);
                lavay = parseInt(parsed[2]);
                lavaz = parseInt(parsed[3]);
                if (lavax >= boxorigin && lavax <= boxsize) {
                    const check1 = `x${lavax + 1}y${lavay}z${lavaz}`;
                    const check2 = `x${lavax - 1}y${lavay}z${lavaz}`;
                    if (!map[check1] && !done[check1]) nextstack.push(check1);
                    else if (map[check1]) score2++;
                    if (!map[check2] && !done[check2]) nextstack.push(check2);
                    else if (map[check2]) score2++;
                }
                if (lavay >= boxorigin && lavay <= boxsize) {
                    const check1 = `x${lavax}y${lavay + 1}z${lavaz}`;
                    const check2 = `x${lavax}y${lavay - 1}z${lavaz}`;
                    if (!map[check1] && !done[check1]) nextstack.push(check1);
                    else if (map[check1]) score2++;
                    if (!map[check2] && !done[check2]) nextstack.push(check2);
                    else if (map[check2]) score2++;
                }
                if (lavaz >= boxorigin && lavaz <= boxsize) {
                    const check1 = `x${lavax}y${lavay}z${lavaz + 1}`;
                    const check2 = `x${lavax}y${lavay}z${lavaz - 1}`;
                    if (!map[check1] && !done[check1]) nextstack.push(check1);
                    else if (map[check1]) score2++;
                    if (!map[check2] && !done[check2]) nextstack.push(check2);
                    else if (map[check2]) score2++;
                }
            }
            analyszestack = [];
            analyszestack = [...nextstack];
        }
        console.log('part2: ', score2);
    }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');
    return arr.join('\n');

}