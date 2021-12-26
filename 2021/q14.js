const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'q14sample.txt';
const count = argv._[1]*1 ?? 10;

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input), count);
});

function process(data, count) {
    let template = data.PolymerTemplate;
    data.Pairs = {}

    for (let i=0;i<template.length-1;i++) {
        data.Pairs[template.substr(i,2)] = 1;
    }

    data.Steps.push(getLength(data.Pairs));

    for (let step=1;step<=count;step++) {
        workPairs = data.Pairs;
        data.Pairs={};

        Object.keys(workPairs).forEach(key => {
            let e = data.Rules[key];
            addPair(data, key.substr(0,1)+e, workPairs[key]);
            addPair(data, e+key.substr(1,1), workPairs[key]);
        })

        let length = getLength(data.Pairs);

        console.log(`After step ${step} length is ${length}`);
        console.log(data.Pairs);
        data.Steps.push(length);
    }

    countMaxMin(data, data.Pairs);

}

function getLength(pairs) {
    return Object.keys(pairs).reduce((t,key) => t+=pairs[key],0) + 1;
}

function addPair(data, pair, count) {
    if (data.Pairs[pair] == undefined) {
        data.Pairs[pair]=count;
    }
    else {
        data.Pairs[pair]+=count*1;
    }
}

function countMaxMin(data,pairs) {
    let letters={};
    Object.keys(pairs).forEach(key => {
        addLetter(letters,key.substr(0,1),pairs[key]);
    });

    addLetter(letters,data.PolymerTemplate.substr(data.PolymerTemplate.length-1,1),1);

    console.log(letters);
    let sorted = Object.keys(letters).sort((a,b) => letters[a]-letters[b]);
    let total = letters[sorted[sorted.length-1]]-letters[sorted[0]];
    console.log(`Max minus min = ${letters[sorted[sorted.length-1]]} - ${letters[sorted[0]]} = ${total}`);
}

function addLetter(letters, letter, count) {
    if (letters[letter]==undefined) {
        letters[letter]=count;
    }
    else {
        letters[letter]+=count;
    }
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let results = {};
    results.PolymerTemplate = arr[0];

    results.Rules={}
    results.Steps=[];
    results.CommonElements=[];

    arr.filter((a,i) => i>1).forEach(a => {
        let e=a.split(' -> ')
        results.Rules[e[0]] = e[1];
    });
    return results;
}