const lineReader = require('line-reader');
let validCount = 0;

lineReader.eachLine('./2020q2input.txt', function(line, last) {
    validCount += validate(line);
    if (last) {
        console.log(validCount);
    }
});


function validate(line) {
    let elements = line.split(' ');
    let range = elements[0].split('-');
    let char = elements[1].replace(/:/,'');

    let valid = 0;
    let invalid = 0;

    elements[2].split('').map((c,i) => {
        if (c==char) {
            if (i== range[0]*1-1 || i==range[1]*1-1) {
                valid++;
            }
            else {
                invalid++;
            }
        }
    });

    if (valid==1) {
        console.log(elements[2], range[0], range[1], char, valid, invalid);
        return 1;
    }

    return 0;
}
