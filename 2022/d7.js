const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/,'.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';


fs.readFile(file, function(err, input) {
    if(err) throw err;

    let data = parseInput(input);
    //console.log(JSON.stringify(data, null, 2));

    const flatDirs = [];
    calcDirSize(data, null, flatDirs);

    part1(flatDirs);
    part2(flatDirs);
});

function part1(flatDirs) {
    console.log(`Processing Part 1`)

    console.log(flatDirs.reduce((t, d) => {
        if (d.size <= 100000) t+=d.size;
        return t;
    } ,0));
}

function part2(flatDirs) {
    console.log(`Processing Part 2`)
    let totalSize = flatDirs.find(f => f.name == '/').size;
    let unused = 70000000 - totalSize;
    let needed = 30000000 - unused;

    console.log(flatDirs.filter(f => f.size > needed).map(s => s.size).sort((a,b) => a - b));
    let min = flatDirs.filter(f => f.size > needed).map(s => s.size).sort((a,b) => a - b)[0];
    console.log(totalSize, unused, needed, min);
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g,'\n').split('\n');

    const data = [];

    arr.forEach((line,i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.push({line, index:i})
        }   
    });

    const fs = [];
    fs.push({name: '/', contents: [], type: 'dir'})

    processFs(data, fs);

    return fs;
}

function processFs(data, fs) {
    while (row = data.shift()) {
        const line = row.line;

        if (line.substring(0,4) == '$ cd') {
            if (line.substring(4).trim() == "..") {
                return;
            }
            processFs(data, fs.find(f => f.name == line.substring(4).trim()).contents)
        }
        else if (line.substring(0,4) == '$ ls') {
            mode = 'ls';
        }
        else if (line.substring(0,3) == 'dir') {
            fs.push({ name: line.substring(4), contents: [], type: 'dir'});
        }
        else {
            let match = line.match(/(\d+) (.*)/);
            fs.push({ name: match[2], size: match[1], type: 'file'});
        }
    }
}

function calcDirSize(fs, name, flatDirs) {
    let size = 0;
    fs.forEach(e => {
        const path = name == null ? e.name : name == '/' ? `/${e.name}` : `${name}/${e.name}`;
        if (e.type == 'dir') {
            size += calcDirSize(e.contents, path, flatDirs) * 1;
        }
        else {
            size += e.size * 1;
        }
    })

    if (flatDirs.findIndex(f => f.name == name) < 0 && name != null) {
        flatDirs.push({name: name, size: size})
    }

    return size;
}