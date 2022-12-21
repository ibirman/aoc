const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';


fs.readFile(file, function(err, input) {
  if (err) throw err;

  let data = parseInput(input);
  part1(data);

  data = parseInput(input);
  part2(data);
});


function part1(data) {
  console.log(`Processing Part 1`)

  mix(data);

  let indexZero = data.list.findIndex(l => l.number == 0);
  let i1000 = getNumber(data, indexZero, 1000);
  let i2000 = getNumber(data, indexZero, 2000);
  let i3000 = getNumber(data, indexZero, 3000);

  console.log(i1000, i2000, i3000, i1000 + i2000 + i3000)
}

function mix(data) {
  let list = data.list;
  let l = list.length;

  for (let i = 0; i < l; i++) {
    let entry = list.find(l => l.position == i);

    if (entry.number == 0) continue;

    let index = list.findIndex(l => l.position == i);
    let newIndex = Number((BigInt(index) + entry.number) % (BigInt(l) - 1n));

    list.splice(index, 1);

    list.splice(newIndex, 0, entry)
  }
}

function getNumber(data, start, position) {
  return data.list[(start + position) % (data.list.length)].number;
}

function part2(data) {
  console.log(`Processing Part 2`)
  data.list.forEach(e => e.number = BigInt(e.number) * 811589153n)
  
  //console.log(data.list.map(l => l.number).join(','));
  for (let i=0;i<10;i++) {
    mix(data);
    //console.log(i, data.list.map(l => l.number).join(','));
  }

  let indexZero = data.list.findIndex(l => l.number == 0);
  let i1000 = getNumber(data, indexZero, 1000);
  let i2000 = getNumber(data, indexZero, 2000);
  let i3000 = getNumber(data, indexZero, 3000);

  console.log(i1000, i2000, i3000, i1000 + i2000 + i3000)

}

function parseInput(input) {
  const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

  const data = {}
  data.list = [];

  arr.forEach((line, i) => {
    if (!(i == arr.length - 1 && line == '')) {
      data.list.push({ number: BigInt(line * 1), position: i })
    }
  });

  return data;
}