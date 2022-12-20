const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');
const { moveMessagePortToContext } = require('worker_threads');
const aStar = require('../lib/node-astar/index.js')

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;
const data = argv._[1] ?? '';
const heights = 'abcdefghijklmnopqrstuvwxyz';


fs.readFile(file, function(err, input) {
    if (err) throw err;

    let data = parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1(data);

    part2(data);
});

function part1(data) {
    console.log(`Processing Part 1`)
    data.coords = findSE(data.heightmap);
    data.map = [];
    data.paths = [];
    data.maxLength = 300;

    for (let i = 0; i < data.heightmap.length; i++) {
        for (let j = 0; j < data.heightmap[0].length; j++) {
            data.map.push({ row: i, col: j, moves: findMoves({ col: j, row: i }, data.heightmap), visited: false });
        }
    }

    var planarNeighbors = function(xy,maze) {
        var x = xy[0], y = xy[1];
        const n = [];
        if (x>0) {
            n.push([x-1,y])
            //if (y>0) n.push([x-1,y-1])
            //if (y<maze.length-1) n.push([x-1,y+1])
        }
        if (x<maze[0].length-1) {
            n.push([x+1,y])
            //if (y>0) n.push([x+1,y-1])
            //if (y<maze.length-1) n.push([x+1,y+1])
        }
        if (y>0) n.push([x,y-1])
        if (y<maze.length-1) n.push([x,y+1])

        return n;
    };
    var euclideanDistance = function(a, b) {
        var dx = b[0] - a[0], dy = b[1] - a[1];
        return Math.sqrt(dx * dx + dy * dy);
    };
    var rectilinearDistance = function(a, b) {
        var dx = b[0] - a[0], dy = b[1] - a[1];
        return Math.abs(dx) + Math.abs(dy);
    };
    let maze = data.heightmap.slice();

    let nodeCount = 100;

    var start;
    for (var y = 0; y < maze.length; y++) {
        var startX = maze[y].indexOf("S");
        if (startX !== -1) {
            start = [startX, y];
            break;
        }
    }

    var end;
    for (y = 0; y < maze.length; y++) {
        var endX = maze[y].indexOf("E");
        if (endX !== -1) {
            end = [endX, y];
            break;
        }
    }

    let options = {
        start: start,
        isEnd: function(n) { return n[0] === end[0] && n[1] === end[1] },
        neighbor: function(xy) {
            return planarNeighbors(xy,maze).filter(nxy => {
                let x = xy[0];
                let y = xy[1];
                let pn = checkHeight(maze[y][x],maze[nxy[1]][nxy[0]]);
                return pn;
            });
        },
        distance: euclideanDistance,
        heuristic: function(xy) {
            return euclideanDistance(xy, end);
        },
    };

    let results = aStar(options);
    console.log(results);

    data.paths = [];
    let startPath = [{ row: data.coords.start.row, col: data.coords.start.col }];

    //data.paths.push(...nextMove({ row: data.coords.start.row, col: data.coords.start.col }, data.map, data.coords.end, startPath, data));
    //console.log(data.paths);

    //let x = data.paths.filter(p => p[p.length - 1].row == data.coords.end.row && p[p.length - 1].col == data.coords.end.col).sort((a, b) => a.length - b.length);
    //console.log(x[0], x[0].length - 1)
}

function part2(data) {
    console.log(`Processing Part 2`)
    data.coords = findSE(data.heightmap);
    data.map = [];
    data.paths = [];
    data.maxLength = 300;

    for (let i = 0; i < data.heightmap.length; i++) {
        for (let j = 0; j < data.heightmap[0].length; j++) {
            data.map.push({ row: i, col: j, moves: findMoves({ col: j, row: i }, data.heightmap), visited: false });
        }
    }

    var planarNeighbors = function(xy,maze) {
        var x = xy[0], y = xy[1];
        const n = [];
        if (x>0) {
            n.push([x-1,y])
            //if (y>0) n.push([x-1,y-1])
            //if (y<maze.length-1) n.push([x-1,y+1])
        }
        if (x<maze[0].length-1) {
            n.push([x+1,y])
            //if (y>0) n.push([x+1,y-1])
            //if (y<maze.length-1) n.push([x+1,y+1])
        }
        if (y>0) n.push([x,y-1])
        if (y<maze.length-1) n.push([x,y+1])

        return n;
    };
    var euclideanDistance = function(a, b) {
        var dx = b[0] - a[0], dy = b[1] - a[1];
        return Math.sqrt(dx * dx + dy * dy);
    };
    var rectilinearDistance = function(a, b) {
        var dx = b[0] - a[0], dy = b[1] - a[1];
        return Math.abs(dx) + Math.abs(dy);
    };
    let maze = data.heightmap.slice();

    var start;
    for (var y = 0; y < maze.length; y++) {
        var startX = maze[y].indexOf("S");
        if (startX !== -1) {
            start = [startX, y];
            break;
        }
    }

    var end;
    for (y = 0; y < maze.length; y++) {
        var endX = maze[y].indexOf("E");
        if (endX !== -1) {
            end = [endX, y];
            break;
        }
    }

    let options = {
        start: start,
        isEnd: function(n) { return n[0] === end[0] && n[1] === end[1] },
        neighbor: function(xy) {
            return planarNeighbors(xy,maze).filter(nxy => {
                let x = xy[0];
                let y = xy[1];
                let pn = checkHeight(maze[y][x],maze[nxy[1]][nxy[0]]);
                return pn;
            });
        },
        distance: euclideanDistance,
        heuristic: function(xy) {
            return euclideanDistance(xy, end);
        },
    };

    console.log(start, end, options);

    let minCost = 1000;

    maze.forEach((r,i) => {
        r.split('').forEach((c,j) => {
            if (c == 'a' || c == 'S') {
                options.start = [j,i];
                let results = aStar(options);
                if (results.status == 'success' && results.cost < minCost) {
                    minCost = results.cost;
                    console.log(results);
                }
            }
        })
    })
    console.log(minCost);
}

function nextMove(coord, map, end, path, data) {
    //console.log('nextMove', coord)
    let spot = map.find(m => m.row == coord.row && m.col == coord.col);
    spot.visited = true;
    let paths = [];

    spot.moves.forEach(m => {
        let row = coord.row;
        let col = coord.col;
        if (m == 'D') row += 1;
        if (m == 'U') row -= 1;
        if (m == 'R') col += 1;
        if (m == 'L') col -= 1;

        //if (m == 'D' || m == 'DL' || m == 'DR') row+=1;
        //if (m == 'U' || m == 'UL' || m == 'UR') row-=1;
        //if (m == 'R' || m == 'DR' || m == 'UR') col+=1;
        //if (m == 'L' || m == 'DL' || m == 'UL') col-=1;

        let visited = path.findIndex(p => p.row == row && p.col == col) > -1;
        let move = map.find(m => m.row == row && m.col == col);
        //console.log(move,row,col,visited,path)

        if (!visited) {
            nextPath = [...path];
            if (nextPath.length < data.maxLength) {
                if (move.row != end.row || move.col != end.col) {
                    nextPath.push({ row: move.row, col: move.col });
                    paths.push(...nextMove({ row: move.row, col: move.col }, map, end, nextPath, data));
                }
                else {
                    path.push({ row: move.row, col: move.col });
                    paths.push(path);
                    data.maxLength = path.length;
                }
            }
        }
    });

    return paths;
}

function findSE(heightmap) {
    let start = {};
    let end
    heightmap.forEach((line, x) => {
        line.split('').forEach((col, y) => {
            if (col == 'S') {
                start = { row: x, col: y }
            }
            if (col == 'E') {
                end = { row: x, col: y }
            }
        })
    })

    return { start, end }
}

function findMoves(coord, heightmap) {
    let moves = [];
    let h = heightmap[coord.row][coord.col];

    if (coord.row > 0) {
        if (coord.col > 0) {
            if (checkHeight(h, heightmap[coord.row - 1][coord.col - 1])) {
                moves.push('UL');
            }
        }
        else if (coord.col < heightmap[0].length - 1) {
            if (checkHeight(h, heightmap[coord.row - 1][coord.col + 1])) {
                moves.push('UR');
            }
        }
        if (checkHeight(h, heightmap[coord.row - 1][coord.col])) {
            moves.push('U');
        }
    }
    if (coord.row < heightmap.length - 1) {
        if (coord.col > 0) {
            if (checkHeight(h, heightmap[coord.row + 1][coord.col - 1])) {
                moves.push('DL');
            }
        }
        else if (coord.col < heightmap[0].length - 1) {
            if (checkHeight(h, heightmap[coord.row + 1][coord.col + 1])) {
                moves.push('DR');
            }
        }
        if (checkHeight(h, heightmap[coord.row + 1][coord.col])) {
            moves.push('D');
        }
    }
    if (coord.col > 0) {
        if (checkHeight(h, heightmap[coord.row][coord.col - 1])) {
            moves.push('L');
        }
    }
    if (coord.col < heightmap[0].length - 1) {
        if (checkHeight(h, heightmap[coord.row][coord.col + 1])) {
            moves.push('R');
        }
    }
    return moves;
}

function checkHeight(h1, h2) {
    return getHeight(h2) <= getHeight(h1) + 1;
}

function getHeight(h) {
    return heights.indexOf(h.replace(/S/, 'a').replace(/E/, 'z'));
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    const data = {}
    data.heightmap = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            data.heightmap.push(line)
        }
    });

    return data;
}