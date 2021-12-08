const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q7sample.txt';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    const data = parseInput(input);
    console.log(data);

    process(data);
});

function process(data) {
    console.log(`Initial state: ${data}`);

    console.log(`Total data size: ${data.length}`);

    let max=0;
    let min=0;
    let minFuel=0;
    let alignment=0;
    let total=0;

    for (let i=0;i<data.length;i++) {
        if (data[i]*1 > max) max = data[i]*1;
        if (data[i]*1 < min || min==0) min=data[i]*1;
        total+=data[i]*1;
    }

    console.log(`Min: ${min}, Max: ${max}, Mean: ${total/data.length}, Median:`);

    for (let j=min;j<max;j++) {

        let fuel = data.reduce((t,h) => {
            let th=Math.abs(h-j);
            //console.log(`Move from ${h} to ${j}: ${th*(th+1)/2} fuel`);
            return t+(th*(th+1))/2
        },0);

        //console.log(`Total fuel for alignment at ${j}: ${fuel}`);

        if (fuel < minFuel || minFuel==0) {
            minFuel=fuel;
            alignment=j;
        }
    }

    console.log(`Minimum fuel for alignment at ${alignment} is ${minFuel}`);
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let lines = [];

    arr.forEach(a => {
        lines.push(a);
    });
   
    return lines[0].split(',');
}