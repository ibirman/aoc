const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const astar = require('astar').astar;
const Graph = require('astar').Graph;

console.log(argv);

const file = argv._[0] ?? 'q15sample.txt';
const count = argv._[1]*1 ?? 10;

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input), count);
});

function process(data) {
    data.grid.forEach(row => {
        console.log(row.join(''));
    })
    var graph = new Graph([
    	[1,1,1,1],
	    [0,1,1,0],
	    [0,0,1,1]
    ]);
    console.log(graph, astar);
    var start = graph.size[0][0];
    var end = graph.size[1][2];
    var result = astar.search(graph, start, end);
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

    let tile = results.grid.slice();
    results.grid=[];

    for (let i=0;i<=4;i++) {
        tile.forEach(row => {
            let resultsRow=[];
            for (let j=0;j<=4;j++) {
                row.forEach((c,k) => {
                    c+=i+j;
                    if (c>19) {
                        c-=19;
                    }else if (c>9) {
                        c-=9;
                    }
                    resultsRow.push(c);
                })
            }
            results.grid.push(resultsRow);
        })
    }

    results.minRisk = (results.grid.length+results.grid[0].length) * 10

    return results;
}