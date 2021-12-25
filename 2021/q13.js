const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q13sample.txt';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input));
});

function process(data) {
    logGraph(data);

    data.Folds.forEach((fold,f) => {
        let graph=[];
        if (fold.Axis == 'y') {
            for (let y=0;y<fold.Value;y++) {
                graph[y]=[];
                for (let x=0;x<data.Graph[0].length;x++) {
                    if (data.Graph[y][x]=='#' || data.Graph[data.Graph.length-y-1][x]=='#') {
                        graph[y][x]='#'
                    }
                    else {
                        graph[y][x]='.'
                    }
                }
            }
            data.Graph=graph;
        }
        if (fold.Axis == 'x') {
            for (let y=0;y<data.Graph.length;y++) {
                graph[y]=[];
                for (let x=0;x<fold.Value;x++) {
                    if (data.Graph[y][x]=='#' || data.Graph[y][data.Graph[0].length-x-1]=='#') {
                        graph[y][x]='#'
                    }
                    else {
                        graph[y][x]='.'
                    }
                }
            }
            data.Graph=graph;
        }

        let dots=0;

        data.Graph.forEach(row => {
            row.forEach(c => {
                if (c == '#') dots++;
            });
        });
        data.Folds[f].Dots = dots;
    });

    logGraph(data);
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let results = {};
    results.Graph = [];
    results.Folds = [];

    let maxY = 0;
    let maxX = 0;

    arr.filter(a => a.substr(0,4) == 'fold').forEach(a => {
        let f=a.split(' ')[2].split('=');
        results.Folds.push({Axis: f[0], Value: f[1], Dots: 0});
    });

    maxX=results.Folds[0].Value*2;
    maxY=results.Folds[1].Value*2;

    arr.filter(a => a != '' && a.substr(0,3) != 'fold').forEach(a => {
        let xy = a.split(',');
        let x = xy[0]*1;
        let y = xy[1]*1;

        if (y>maxY) maxY=y;
        if (x>maxX) maxX=x;

        if (results.Graph[y]==undefined) {
            results.Graph[y]=[];
        }
        results.Graph[y][x]='#';
    });

    for (let y=0;y<=maxY;y++) {
        if (results.Graph[y] == undefined) {
            results.Graph[y]=[];
        }
        for (let x=0;x<=maxX;x++) {
            if (results.Graph[y][x]== undefined) {
                results.Graph[y][x] = '.';
            }
        }
    }

    console.log(maxY, maxX)
    return results;
}

function logGraph(data) {
    let dots=0;

    data.Graph.forEach(row => {
        let line='';
        row.forEach(c => {
            line+=c
            if (c == '#') dots++;
        });
        console.log(line);
    })

    console.log(data.Graph.length, data.Graph[0].length)

    console.log(`There are ${dots} dots`);
    console.log(data.Folds);
}