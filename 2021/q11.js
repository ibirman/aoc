const { execFileSync } = require('child_process');
const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q11sample.txt';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input));
});

function process(grid) {
    logGrid(`Initial`, grid);
    let totalFlashes = 0;

    for (let step=1;step<=800;step++) {
        // Handle Step
        grid.forEach((row,y) => {
            row.forEach((cell,x) => {
                increment(grid,x,y);
            })
        })

        // Handle Flash
        //logGrid(`After step ${step}`, grid);
        let flash=true;

        while(flash) {
            flash=false;
            let efs=[];

            grid.forEach((row,y) => {
                row.forEach((cell,x) => {
                    if (cell != 'F' && cell != 'G') {
                        let flashCount = countFlashes(grid,x,y);
                        efs.push({x:x,y:y,count:flashCount})

                        if (flashCount > 0) {
                            flash=true;
                        }
                    }
                    else {
                        efs.push({x:x,y:y,count:1});
                    }
                })
            })

            efs.forEach(g => {
                if (grid[g.y][g.x] != 'F' && grid[g.y][g.x] != 'G') {
                    for (let i=0;i<g.count;i++) {
                        increment(grid,g.x,g.y);
                    }
                }
                else grid[g.y][g.x]='G';
            });

            //logGrid(`Flash ${flash}`, grid);
        }

        // Reset flashes
        grid.forEach((row,y) => {
            row.forEach((cell,x) => {
                if (cell == 'G') totalFlashes++;
                if (cell == 'F' || cell == 'G') grid[y][x]='0';
            })
        })

        //logGrid(`End step ${step}`, grid);
        // Check if all flashed
        all=true;
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell != '0') all=false;
            })
        })
        if (all) {
            logGrid(`All Flashed at step ${step}`, grid);
        }
    }

    logGrid(`Last step`, grid);
    console.log(`Total flashes ${totalFlashes}`)
    //console.log(grid);
}

function increment(grid,x,y) {
    if (x<0 || x>grid[0].length-1 || y<0 || y>grid.length-1) {
        return 0;
    }

    let val=grid[y][x];

    if (val == 'F') {
        return 0;
    }
    else if (val == '9') {
        grid[y][x]='F';
        return 1;
    }
    else {
        grid[y][x]=(val*1+1)+'';
        return 1;
    }
}

function countFlashes(grid,x,y) {
    let seenFlashCount = seeFlash(grid,x-1,y-1) + 
        seeFlash(grid,x-1,y) + 
        seeFlash(grid,x-1,y+1) + 
        seeFlash(grid,x,y-1) +
        seeFlash(grid,x,y) +
        seeFlash(grid,x,y+1) + 
        seeFlash(grid,x+1,y-1) +
        seeFlash(grid,x+1,y) + 
        seeFlash(grid,x+1,y+1);

    return seenFlashCount;
}

function seeFlash(grid,x,y) {
    if (x<0 || x>grid[0].length-1 || y<0 || y>grid.length-1) {
        return false;
    }

    return grid[y][x] == 'F';
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let results = [];

    arr.filter(a => a != '').forEach(a => {
        results.push(a.split('').map(a => a+''));
    });
   
    return results;
}

function logGrid(message, grid) {
    console.log('\n' + message);
    grid.forEach(row => console.log(`${row.join('')}`))
}