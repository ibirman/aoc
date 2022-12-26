const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};
const sd = ['=', '-', '0', '1', '2']

fs.readFile(file, function(err, input) {
    if (err) throw err;

    parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    let total = 0;
    data.snafu.forEach(sn => {
        total += snafuToDecimal(sn);
    })
    console.log(total, (total).toString(5), snafuToDecimal('2=-1=0'), snafuToDecimal('2=01-0-2-0=-0==-1=01'));
    console.log(data.snafu)
}

function part2() {
    console.log(`Processing Part 2`)
}

function snafuToDecimal(sn) {
    let n = 0;

    sn.split('').reverse().forEach((s, i) => {
        n += (sd.findIndex(a => a == s) - 2) * (5 ** i)
    });

    console.log(sn, n, (n).toString(5))

    return n;
}

function decimalTosnafu(n) {
    let n5 = (n).toString(5);
    n.split('').forEach(c => {


    })

}

function carry(n) {
    let a = n.split('');
    a.forEach((c,i) => {
        if (c == '0') {
            c = '1'
        }
        else if (c == '1') {
            c = '2'
        }
        else if (c == '2') {
            c = '-'
        }
        else if (c == '-') {
            c = '='
        }
        else if (c == '=') {
            c = '0'
            
        }
    })
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    data.snafu = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.snafu.push(line)
        }
    });

    let all = []

    for (let l = -1; l < 5; l++) {
        let sl = getSn(l);
        for (let k = -1; k < 5; k++) {
            let sk = sl + getSn(k);
            for (let j = -1; j < 5; j++) {
                let sj = sk + getSn(j);
                for (let i = 0; i < sd.length; i++) {
                    let si = sj + sd[i];
                    all.push({ s: si, d: snafuToDecimal(si) });
                }
            }
        }
    }

    all.sort((a, b) => a.d - b.d);
    all.forEach((a, i) => {
        if (i > 0) {
            //console.log(a.d,(a.d).toString(5),a.s,a.d-all[i-1].d)
        }
    })
}

function getSn(d) {
    if (d == -1) return '';
    else return sd[d]
}