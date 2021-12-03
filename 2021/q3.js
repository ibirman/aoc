const fs = require('fs');

fs.readFile('q3.txt', function(err, data) {
    if(err) throw err;

    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    
    console.log(`Data length: ${arr.length}`);

    const p1 = part1(arr);
    const p2 = part2(arr, p1);

    console.log(`Power Consumption: ${p1.PowerConsumption}`);
    console.log(p2);
    console.log(`Life Support Rating: ${p2.OxygenGeneratorRatingDec * p2.CO2ScrubberRatingDec}`);
});

function part1(data) {
    let ones = [0,0,0,0,0,0,0,0,0,0,0,0];
    let most=[];
    let least=[];

    for (let i=0;i<ones.length;i++) {
        let r = getCommon(data, i);

        most.push(r.mostCommon);
        least.push(r.leastCommon);
    }

    console.log(most, least)

    let gamma = '';
    for (var k=0;k<most.length;k++) {
        gamma += most[k]+'';
    }

    let epsilon = '';
    for (var k=0;k<least.length;k++) {
        epsilon += least[k]+'';
    }

    let pc = parseInt(gamma,2) * parseInt(epsilon,2);

    console.log(`Gamma rate:   ${gamma}, ${parseInt(gamma, 2)}`);
    console.log(`Epsilon rate: ${epsilon}, ${parseInt(epsilon, 2)}`);
    return { Gamma: gamma, Epsilon: epsilon, PowerConsumption: pc };
}

function part2(data, p1) {
    let oxygenGeneratorRating = getRate(data, 'Most');
    let co2ScrubberRating = getRate(data, 'Least');

    return { 
        OxygenGeneratorRating: oxygenGeneratorRating, 
        OxygenGeneratorRatingDec: parseInt(oxygenGeneratorRating, 2), 
        CO2ScrubberRating: co2ScrubberRating,
        CO2ScrubberRatingDec: parseInt(co2ScrubberRating, 2), 
    };

}

function getRate(data, q) {
    fd=data.slice();
    rate='';
    let l=data[0].length;

    for (let i=0;i<l; i++) {
        let common=getCommon(fd,i);
        let fdx=fd.slice();

        if (q=='Most') {
            fdx=fd.filter(d => d[i]==common.mostCommon);
        }
        else {
            fdx=fd.filter(d => d[i]==common.leastCommon);
        }

        if (fdx.length>0) {
            fd=fdx.slice();
        }

        console.log(q, fd.length, fd[0].substr(0,i+1));
        
        if (fd.length == 1) {
            rate=fd[0];
            break;
        }
    }
    console.log(rate);
    return rate;
}

function getCommon(data, position) {
    let ones=0;
    let zeroes=0;

    for (let i=0;i<data.length;i++) {
        if (data[i][position]=='1') {
            ones++;
        }
        else {
            zeroes++;
        }
    }

    return {
        mostCommon: ones >=zeroes ? 1 : 0,
        leastCommon: zeroes <= ones ? 0 : 1 
    }
}