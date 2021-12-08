const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q8sample.txt';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    const data = parseInput(input);
    console.log(data);

    process(data);
});

function process(data) {
    let sum=0;

    data.forEach(segment =>{
        segment.Digits = decodeInputs(segment.Inputs);

        segment.Led = decodeOutputs(segment) * 1;
        sum+=segment.Led;
        console.log(segment);
    });

    console.log(sum);
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    let segments = [];

    arr.forEach(a => {
        let line = a.split(' | ');
        let inputs = line[0].split(' ');
        let outputs = line[1].split(' ');
        segments.push({
            Inputs: inputs,
            Outputs: outputs.map(o => setDigit(o))
        })
    });
   
    return segments;
}

function decodeInputs(inputs) {
    let digits = {
        '1': setDigit(inputs.filter(o => o.length==2)[0]),
        '4': setDigit(inputs.filter(o => o.length==4)[0]),
        '7': setDigit(inputs.filter(o => o.length==3)[0]),
        '8': setDigit(inputs.filter(o => o.length==7)[0])
    }

    inputs.filter(o=> o.length==5).forEach(o => {
        const m = findUnmatchedChars(digits['1'], o);

        if (m.length == 0) {
            digits['3'] = setDigit(o);
        }
        else {
            let n = findUnmatchedChars(digits['4'], o);

            if (n.length == 1) {
                digits['5'] = setDigit(o);
            }
            else {
                digits['2'] = setDigit(o);
            }
        }
    });

    inputs.filter(o=> o.length==6).forEach(o => {
        const m = findUnmatchedChars(digits['1'], o);

        if (m.length == 1) {
            digits['6'] = setDigit(o);
        }
        else {
            let n = findUnmatchedChars(digits['4'], o);

            if (n.length == 1) {
                digits['0'] = setDigit(o);
            }
            else {
                digits['9'] = setDigit(o);
            }
        }
    });

    return digits;
}

function decodeOutputs(segment) {
    let output='';

    segment.Outputs.forEach(o => {
        let digit='';
        Object.keys(segment.Digits).forEach(k => {
            let d = segment.Digits[k];
            if (d == setDigit(o)) {
                digit=k
            }
        });
        
        output += digit;
    });

    return output;
}

function findUnmatchedChars(string1, string2) {
    for (i=0;i<string2.length;i++) {
        string1 = string1.replace(string2.substr(i,1),'');
    }

    return string1;
}

function setDigit(o) {
    return o.split('').sort().join('');
}