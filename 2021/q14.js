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

    console.log(data.Pairs);

    for (let j=0;j<count;j++) {
        workPairs = data.Pairs;
        Object.keys(workPairs).forEach(key => {
            let e = data.Rules[key].Element;
        })
    }

    let most=0;
    let least=0;

    console.log(most - least)

    console.log(data);

}

function step(template, data) {
    let polymer = template.substr(0,1); 
    for (let i=0;i<template.length-1;i++) {
        let pair = template.substr(i,2);
        let rules = data.Rules.filter(r => r.Pair == pair);

        if (rules.length==1) {
            polymer += rules[0].Element+pair.substr(1,1);
        }
        else {
            polymer += pair;
        }
    }

    return polymer;
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