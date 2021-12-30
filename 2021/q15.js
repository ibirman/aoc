const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'q15sample.txt';
const count = argv._[1]*1 ?? 10;

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input), count);
});

function process(data) {
    //console.log(data);

    let y=0;
    let x=0;
    let paths = [];
    let start = {
        path: [{y:0,x:0}],
        risk: 0
    }

    next(data, start).forEach(followedPath => {
        console.log(`Processing ${followedPath.path.length} paths`)
        let last = followedPath.path[followedPath.path.length-1];
        if (followedPath.risk <= data.minRisk && last.x==data.grid[0].length-1 && last.y==data.grid.length) {
            console.log(`Adding path with ${followedPath.risk}`)
            paths.push(followedPath);
        }
    });

    let minRisk = data.minRisk;
    let bestPath = [];

    paths.forEach(p => {
        if (p.risk < minRisk) {
            minRisk = p.risk;
            bestPath = p.path;
        }
    })

    console.log(minRisk, bestPath, paths.length);
}

function next(data,path) {
    if (path.risk >= data.minRisk) {
        return [];
    }
    let paths = [];
    let last = path.path[path.path.length-1];

    if (last.x < data.grid[0].length - 1) {
        next(data, addPath(data,path,last.x+1,last.y)).forEach(followedPath => {
            if (followedPath.path.risk < data.minRisk) {
                paths.push(followedPath);
            }
        })
    }

    if (last.y < data.grid.length - 1) {
        next(data, addPath(data,path,last.x,last.y+1)).forEach(followedPath => {
            if (followedPath.path.risk < data.minRisk) {
                paths.push(followedPath);
            }
        })
    }

    if (last.y==data.grid.length-1 && last.x == data.grid[0].length - 1) {
        if (path.risk < data.minRisk) {
            data.minRisk = path.risk;
            console.log(`Found a path with risk of ${path.risk}`);
            paths = [path];
        }
    }
    else if(paths.length == 0) {
        paths.push(path);
    }

    return paths;
}

function addPath(data,path,x,y) {
    return {
        path: path.path.concat({y:y,x:x}),
        risk: path.risk + data.grid[y][x]
    }
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let results = {}
    results.grid=[];

    arr.forEach(line => {
        let row=[];
        line.split('').forEach(c => {
            row.push(c*1);
        })
        results.grid.push(row);
    })

    results.minRisk = (results.grid.length+results.grid[0].length) * 10
    results.minRisk = 500;

    return results;
}