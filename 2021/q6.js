const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q6.txt';
const rounds = argv._[1]*1 ?? 80;

fs.readFile(file, function(err, data) {
    if(err) throw err;

    const fish = parseInput(data);
    console.log(fish);

    process(1, fish, rounds);
});

function process(part, data, days) {
    console.log(`Initial state: ${data}`);

    let gen = [0,0,0,0,0,0,0,0,0];

    for (let i=0;i<data.length;i++) {
        gen[data[i]]++;
    }

    console.log(gen);

    for (let j=1;j<=days;j++) {
        let spawn=gen[0];
    
        for (let k=0;k<8;k++) {
            gen[k]=gen[k+1];
        }

        gen[8]=spawn;
        gen[6]+=spawn;
        console.log(`Day ${j}: ${gen}`);
    }

    let totalFish = gen.reduce((p,g) => p+g);

    console.log(`Part ${part} total: ${totalFish}`);
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let lines = [];

    arr.forEach(a => {
        lines.push(a);
    });
   
    return lines[0].split(',');
}