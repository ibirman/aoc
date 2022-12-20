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

    part2(data);
});

function part1(data) {
		console.log(`Processing Part 1`)
		let l = data.mix.length;
		for (let i=0;i<l;i++) {
			let j = data.mix.findIndex(d => d.position == i);
			let e = data.mix[j]
			let k = j + e.number;
			if (k < 0) k+=l;
			if (k > l) k-=l;
			data.mix.splice(j,1);
			if (k > j) k--;
			data.mix.splice(k,1,e);
		}
		console.log(data)
}

function part2(data) {
    console.log(`Processing Part 2`)
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

		const data = {}
		data.mix = [];

    arr.forEach((line,i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.mix.push({number:line*1,position:i})
        }   
    });

    return data;
}