const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'q18sample.txt';
const data = argv._[1] ?? '';

if (data != '') {
    console.log(data);
    part1(data);
}
else {
    fs.readFile(file, function(err, input) {
        if(err) throw err;

        let data = parseInput(input);

        data.forEach(d => part1(d));
    });
}

function part1(data) {
    console.log(`Processing ${data}`)

    let sn=eval(data);
    processPair(sn, 1);
    console.log(sn[0][0]);
}

function processPair(sn, depth) {
    console.log('Process', sn, depth);
    let explode=sn.length > 0;

    while (explode == true) {
        explode = false;

        sn.forEach((n,i) => {
            console.log(`Depth ${depth}, Type ${typeof(n)}, ${i}, ${sn[i+1]}`, n)
            if (typeof(n) == 'object') {
                if (processPair(n, depth+1)) {
                    explode = true;
                };
            }
            else {
                if (depth == 5 && typeof(n) == 'number' && sn[i+1] != undefined && typeof(sn[i+1] == 'object')) {
                    console.log(`Hit ${depth}, ${n}, ${sn[n+1]}`)
                    n[1] += sn[i+1][0];
                    sn[i+1] = sn[i+1][1];
                    explode=true;
                }
            }
        })
    }
    
    return explode;
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    return arr;
}