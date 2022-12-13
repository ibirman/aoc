const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';


fs.readFile(file, function(err, input) {
    if (err) throw err;

    let data = parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1(data);

    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`)
    let total = 0;
    data.forEach((line,index) => {
        console.log(index, line);
        let list = [];
        let c = compare(line.left,line.right,list)
        if (c == 'right') {
            total += index + 1;
        }
    })

    console.log(`Sum of indexes is ${total}`);
}

function compare(a, b, list) {
    console.log(`Compare ${a} vs ${b}`);

    if (typeof(a) == 'number' && typeof(b) == 'number') {
        if (a > b) {
            list.push('left');
            return 'left';
        }
        if (b > a) {
            list.push('right');
            return 'right';
        }
        list.push('equal');
        return 'equal';
    }
    else {
        if (typeof(a) == 'number') {
            return compare([a],b,list)
        }
        else if (typeof(b) == 'number') {
            return compare(a,[b],list)
        }
        else {
            for (let i = 0;i<a.length||i<b.length;i++) {
                if (a[i]==undefined) {
                    list.push('right');
                    return 'right'
                }
                if (b[i]==undefined) {
                    list.push('left');
                    return 'left'
                }

                let c = compare(a[i],b[i],list);

                if (c != 'equal') {
                    list.push(c);
                    return c;
                }
            }
            list.push('equal')
            return 'equal'
        }
    }

}

function part2(data) {
    console.log(`Processing Part 2`)
    let packets = [[[2]],[[6]]];
    data.forEach(line => {
        packets.push(line.left);
        packets.push(line.right);
    });

    packets.sort((a,b) => {
        let l = [];
        let c = compare(a,b,l)
        if (c == 'left') {
            return 1;
        }
        if (c == 'right') {
            return -1;
        }
        return 0;
    });

    let p2=0;
    let p6=0;

    packets.forEach((p,i) => {
        if (p.length == 1 && p[0].length == 1 && p[0][0] == 2) {
            console.log(`2 is at index ${i+1}`);
            p2=i+1;
        }
        if (p.length == 1 && p[0].length == 1 && p[0][0] == 6) {
            console.log(`6 is at index ${i+1}`);
            p6=i+1;
        }
    })

    console.log(packets.map(p => p.toString()));
    console.log(p2*p6)
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = [];
    let left = {};
    let right = {};

    let last = false;

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            if (line.substring(0, 1) == '[') {
                if (!last) {
                    left = eval(line);
                    last = true;
                }
                else {
                    right = eval(line);
                    last = false;
                    data.push({ left: left, right: right })
                }
            }
        }
    });

    return data;
}