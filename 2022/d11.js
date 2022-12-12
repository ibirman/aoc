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
    //part1(data);

    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`)
    for (let round = 0; round < 20; round ++) {
        processRound(data, true);
    }

    data.sort((a,b) => a.Inspected - b.Inspected).reverse();

    console.log(data);

    console.log(data[0].Inspected * data[1].Inspected)
}

function part2(data) {
    console.log(`Processing Part 2`)

    let maxDivisor = 0n;
    let productPrimes = 0n;

    data.forEach(d => {
        if (maxDivisor < d.Test) {
            maxDivisor = d.Test
        }
        if (productPrimes == 0) {
            productPrimes = d.Test;
        }
        else {
            productPrimes *= d.Test;
        }
    });

    console.log(`The largest divisor is ${maxDivisor}, the product of the primes is ${productPrimes}`);

    for (let round = 0; round < 10000; round ++) {
        if (round % 100 == 0) {
            console.log(round, data);
        }
        processRound(data, productPrimes);
    }

    data.sort((a,b) => a.Inspected - b.Inspected).reverse();


    console.log(data);

    console.log(data[0].Inspected * data[1].Inspected)
}

function processRound(data, productPrimes) {
    data.forEach(m => {
        //console.log(m.Monkey)
        m.Items.forEach(item => {
            // inspect item
            //console.log(`Inspecting ${item} for monkey ${m.Monkey}`)
            let ops = m.Operation.split(' ');
            let n1 = 0n;
            let n2 = 0n;
            let wl = 0n;

            if (ops[2] == 'old') {
                n1 = BigInt(item);
            }
            else {
                n1 = BigInt(ops[2])
            }
            if (ops[4] == 'old') {
                n2 = BigInt(item);
            }
            else {
                n2 = BigInt(ops[4])
            }

            if (ops[3] == '*') {
                wl = n1 * n2
            }
            else if (ops[3] == '+') {
                wl = n1 + n2
            }
            else if (ops[3] == '-') {
                wl = n1 - n2
            }
            else {
                wl = n1 / n2
            }

            if (wl > productPrimes) {
                wl = wl % productPrimes;
            }

            let div = (wl % m.Test == 0) ? true : false

            // throw item
            if (div) {
                data[BigInt(m.True.split(' ')[3])].Items.push(wl)
            }
            else {
                data[BigInt(m.False.split(' ')[3])].Items.push(wl)
            }
            m.Inspected++;

        });

        m.Items = [];
    });
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    const data = [];
    let monkey = {};

    arr.forEach((line,i) => {
        if (line.substring(0,6) == 'Monkey') {
            monkey = {Monkey:line.split(' ')[1].split(':')[0]*1,Inspected:0}
        }
        else if (line.substring(2,10) == 'Starting') {
            monkey.Items = line.split(': ')[1].split(', ').map(i => BigInt(i));
        }
        else if (line.substring(2,11) == 'Operation') {
            monkey.Operation = line.split(': ')[1];
        }
        else if (line.substring(2,6) == 'Test') {
            monkey.Test = BigInt(line.split(': ')[1].split(' ')[2]);
        }
        else if (line.substring(4,11) == 'If true') {
            monkey.True = line.split(': ')[1];
        }
        else if (line.substring(4,12) == 'If false') {
            monkey.False = line.split(': ')[1];
        }
        else if (line == '') {
                data.push(monkey);
        }
    });

    return data;
}