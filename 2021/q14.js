const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q14sample.txt';
const count = argv._[1]*1 ?? 10;

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input), count);
});

function process(data, count) {
    let template = data.PolymerTemplate;

    for (let i=0;i<count;i++) {
        template = step(template, data);
        data.Steps.push(template);
    }

    let commonElements={};

    for (let i=0;i<data.Steps[count-1].length;i++) {
        let el=data.Steps[count-1].substr(i,1);
        if (commonElements[el] == null) {
            commonElements[el]=1;
        }
        else {
            commonElements[el]++;
        }
    }

    data.CommonElements=commonElements;

    let most=0;
    let least=0;

    Object.keys(data.CommonElements).forEach(key => {
        if (data.CommonElements[key] > most) {
            most = data.CommonElements[key];
        }
        if (data.CommonElements[key] < least || least == 0) {
            least = data.CommonElements[key];
        }
    })

    console.log(data);
    console.log(most - least)

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

    results.Rules=[];
    results.Steps=[];

    arr.filter((a,i) => i>1).forEach(a => {
        let e=a.split(' -> ')
        results.Rules.push({Pair: e[0], Element: e[1]});
    });
    return results;
}