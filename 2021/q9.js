const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q9sample.txt';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input));
});

function process(grid) {
    let lowpoints = findLowest(grid);

    let risk = lowpoints.reduce((sum,p) => sum + p.RiskLevel, 0);

    console.log(`Low points: ${lowpoints.map(l => l.Height)}, Risk: ${risk}`);

    let sizes = [];

    lowpoints.forEach(l => {
        sizes.push(Object.keys(l.Basin).length)
    })

    sizes.sort((a,b) => b-a);
    console.log(sizes, sizes[0]*sizes[1]*sizes[2]);
}

function findLowest(grid) {
    let lowpoints = [];

    grid.forEach((row,y) => {
        row.forEach((point,x) => {
            if (checkLowPoint(point,x,y,grid)) {
                lowpoints.push({ X: x, Y: y, Height: point*1, RiskLevel: point*1+1});
            }
        });
    });

    lowpoints.forEach(l => {
        l = growBasin(grid, l);
    })

    //console.log(lowpoints);

    return lowpoints;

}

function checkLowPoint(point,x,y,grid) {
    if ((y == 0 || grid[y - 1][x] > point) &&
        (y == grid.length - 1 || grid[y + 1][x] > point) &&
        (x == 0 || grid[y][x - 1] > point) &&
        (x == grid[y].length - 1 || grid[y][x + 1] > point)) {
            return true;
    }
    else {
        return false;
    }
}

function growBasin(grid, point) {
    if (point.Basin == null) {
        point.Basin = {};
        point.Basin[`${point.X},${point.Y}`] = { X: point.X, Y: point.Y, Processed: false };
    }

    let lastBasinSize = 0;

    while (Object.keys(point.Basin).filter(b => point.Basin[b].Processed == false).length > 0) {
        lastBasinSize = Object.keys(point.Basin).length;

        Object.keys(point.Basin).filter(b => point.Basin[b].Processed == false).forEach(function(key) {
            console.log(key, point.Basin[key]);
            let p = point.Basin[key];
            if (checkUp(p, point.Basin, grid)) point.Basin[`${p.X},${p.Y-1}`] = { X: p.X, Y: p.Y - 1, Processed: false};
            if (checkDown(p, point.Basin, grid)) point.Basin[`${p.X},${p.Y+1}`] = { X: p.X, Y: p.Y + 1, Processed: false};
            if (checkLeft(p, point.Basin, grid)) point.Basin[`${p.X-1},${p.Y}`] = { X: p.X - 1, Y: p.Y, Processed: false};
            if (checkRight(p, point.Basin, grid)) point.Basin[`${p.X+1},${p.Y}`] = { X: p.X + 1, Y: p.Y, Processed: false};
            point.Basin[key].Processed = true;
        });

        //console.log(`While loop ${lastBasinSize}, ${Object.keys(point.Basin).length}`)
    }

    //console.log(point.Basin);
}

checkUp = (point, basin, grid) => point.Y > 0 && checkBasinPoint(grid, basin, point.X, point.Y-1);
checkDown = (point, basin, grid) => point.Y < grid.length - 1 && checkBasinPoint(grid, basin, point.X, point.Y+1);
checkLeft = (point, basin, grid) => point.X > 0 && checkBasinPoint(grid, point, point.X-1, point.Y);
checkRight = (point, basin, grid) => point.X < grid[0].length && checkBasinPoint(grid, basin, point.X+1, point.Y);

function checkBasinPoint(grid, basin, x, y) {
    let key = `${x},${y}`;
    //console.log(`Checking ${key}, ${basin[key]}, ${grid[y][x]}`)

    if (basin[key] == null || basin[key].Processed == false) {
        return grid[y][x] < 9;
    }
    else {
        return false;
    }

}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    let grid = [];

    arr.forEach(a => {
        let row = a.split('').map(p => p*1);
        grid.push(row)
    });
   
    return grid;
}