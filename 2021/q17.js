const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');
const { map } = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'q17sample.txt';
const data = argv._[1] ?? '';
let totalVersion = 0;

fs.readFile(file, function(err, input) {
    if(err) throw err;

    let data = parseInput('x=20..30, y=-10..-5');
    part1(data, 1);
    console.log(data, data.InitialVelocities.length);

    data = parseInput('x=175..227, y=-134..-79');
    part1(data, 1);
    console.log(data.MaxY, data.InitialVelocities.length);
});

function part1(data, part) {
    console.log(`Processing Part ${part}`)
    console.log(data);
    let trajectory = [] 
    let maxY=data.Y[0];
    data.InitialVelocities=[];

    for (let vXstart=1;vXstart<400;vXstart++) {
        for (let vYstart=-400;vYstart<400;vYstart++) {
            let result = fire(data, vXstart, vYstart);
            if (result.Hit) {
                let tMaxY = Math.max(...result.Trajectory.map(t => t.Y));

                if (tMaxY > maxY) {
                    maxY = tMaxY;
                    trajectory = result.Trajectory;
                }
                let iv = `${vXstart},${vYstart}`;
                if (data.InitialVelocities.findIndex(i => i==iv) == -1) {
                    data.InitialVelocities.push(iv);
                }
            }
        }
    }

    data.MaxY = maxY;

    let maxX = Math.max(...trajectory.map(t => t.X),data.X[1])
    let minX = Math.min(...trajectory.map(t => t.X))
    //let maxY = Math.max(...trajectory.map(t => t.Y))
    let minY = Math.min(...trajectory.map(t => t.Y),data.Y[0])

    let map = [];

    for (let y=maxY;y>=minY;y--) {
        let line = '';
        for (let x=minX;x<maxX;x++) {
            if (x==0 && y==0) {
                c='S'
            } 
            else if (trajectory.findIndex(t => t.X==x && t.Y==y) > -1) {
                c='#'
            }
            else if (x >= data.X[0] && x <= data.X[1] && y <= data.Y[1] && y >= data.Y[0]) {
                c = 'T'
            }
            else {
                c = '.'
            }
            line += c;
        }
        map.push(line);
    }

    data.Map = map;
}

function fire(data, vXstart, vYstart) {
    let results = {};

    let vX=vXstart;
    let vY=vYstart;
    let pX=0;
    let pY=0;
    let maxX=0;
    let maxY=0;
    let hit = false;

    trajectory=[];
    trajectory.push({ X: 0, Y: 0 });

    while (pX <= data.X[1] && pY >= data.Y[0] && hit==false) {
        pX+=vX;
        pY+=vY;
        trajectory.push({X:pX,Y:pY});

        if (pX > maxX) maxX=pX;
        if (pY > maxY) maxY=pY;

        if (vX > 0) {
            vX -= 1;
        }
        else if (vX < 0) {
            vX += 1;
        }

        vY-=1;

        if (pX >= data.X[0] && pX <= data.X[1] && pY >= data.Y[0] && pY <= data.Y[1]) {
            hit = true;
            results.Trajectory = trajectory;
            results.HitPosition = {X: pX, Y: pY };
            results.Hit = true;
            results.MaxY = maxY;
        }
    }
    return results;
}
function part2(data) {
    console.log(`Processing Part 2`)
    console.log(data);

}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    let input = {};

    let xy=arr[0].split(', ').map(c => c.split('='))

    input.X = xy[0][1].split('..').map(v => v*1)
    input.Y = xy[1][1].split('..').map(v => v*1)
    console.log(Math.max(...input.X))
    input.Center = [(Math.abs(Math.max(...input.X))-Math.abs(Math.min(...input.X)))/2,(Math.abs(Math.max(...input.Y))-Math.abs(Math.min(...input.Y)))/2];

    return input;

}