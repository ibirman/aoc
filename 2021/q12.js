const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q12sample.txt';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input));
});

function process(data) {
    //logPaths(`Initial`, data);
    data.Links.filter(d => d.From == 'start').map(p => {
        data.Paths = data.Paths.concat(followPath(data, [p], 0));
    })
    let sp = data.Paths.sort((a,b) => a>b)
    data.Paths = sp;
    logPaths(`Final`, data);
    console.log(`There are ${data.Paths.length} paths`)
}

function followPath(data, path, depth) {
    //console.log(`Depth: ${depth}`, path);
    let nextPaths = [];

    data.Links.filter(l => path[path.length-1].To == l.From).forEach(l => {
        //console.log(`Link:`, l);

        if (l.To == 'end') {
            nextPaths.push(path.concat(l));
        }
        else if (depth<100) {
            // find all caves visits
            let doubleOk = true;
            let lv = path.filter(p => p.To == l.To).length;

            if (isSmall(l.To) && lv > 0) {
                data.Smalls.forEach(s => {
                    let visits = path.filter(p => p.To == s).length;
                    if (visits > 1) {
                        doubleOk = false;
                    }
                })

                if (doubleOk == true) {
                    //console.log(`${l.To} can be visited again`, path)
                }
            }

            if (!isSmall(l.To) || doubleOk) {
                followPath(data, path.concat(l), ++depth).forEach(p => {
                    nextPaths.push(p);
                });
            }
        }
    });

    return nextPaths;
}

function isSmall(cave) {
    if (cave == 'start' || cave == 'end') {
        return false;
    }
    else if (cave == cave.toLowerCase()) {
        return true;
    }
    else {
        return false;
    }
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let results = {};
    results.Links = [];

    arr.filter(a => a != '').forEach(a => {
        let l = a.split('-');

        if (l[1]!='start' && l[0]!='end') {
            results.Links.push({From: l[0], To: l[1]});
        }

        if (l[0]!='start' && l[1]!='end') {
            results.Links.push({From: l[1], To: l[0]});
        }
    });

    results.Caves = {};
    results.Smalls = [];

    results.Links.forEach(l => {
        if (results.Caves[l.From] == null) {
            results.Caves[l.From] = { Type: GetCaveType(l.From), Visits: 0 };
        }
        if (results.Caves[l.To] == null) {
            results.Caves[l.To] = { Type: GetCaveType(l.To), Visits: 0 };
        }
        if (isSmall(l.To) && results.Smalls.findIndex(s => s==l.To) == -1) {
            results.Smalls.push(l.To);
        }
    })

    results.Paths = [];
   
    return results;
}

function logPaths(message, paths) {
    console.log('\n' + message);

    let pathLists=[];

    paths.Paths.forEach(path => {
        let list="";
        path.forEach((p,i) => {
            if (i==0) {
                list=`${p.From},${p.To}`;
            }
            else {
                list=`${list},${p.To}`
            }
        });
        pathLists.push(list);
    });

    console.log(paths.Links, paths.Caves, paths.Smalls, pathLists);
}

function GetCaveType(name) {
   return name == "start" ? "Start" : name == "end" ? "end" : name.toLowerCase() == name ? "Small" : "Large";
}