const fs = require('fs');

fs.readFile('d1.txt', function(err, data) {
    if(err) throw err;

    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    let elf=[];
    let c=0;
    let i=1;

    for(const element of arr) {
        if (element === '') {
            elf.push({elf: i, calories: c});
            c=0;
            i++;
        }
        else {
            c+=element*1;
        }
    }
    elf.push({elf: i, calories: c});

    elf.sort((a,b) => a.calories - b.calories);
    let total = 0;

    for(i=elf.length - 3; i<elf.length; i++) {
        console.log(elf[i]);
        total += elf[i].calories;
    }

    console.log(total);
});