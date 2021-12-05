const fs = require('fs');

fs.readFile('q5.txt', function(err, data) {
    if(err) throw err;

    const lines = parseInput(data);
    console.log(lines);
    const points = {};
    let overlap=0;

    lines.forEach(l => {
        let x=l.x1;
        let y=l.y1;
        let done=false;

        console.log(`Processing`,l);

        while (!done) {
            let p=`${x},${y}`;

            if (!points[p]) {
                points[p]=1;
            }
            else {
                points[p]++;
                if (points[p]==2) {
                    overlap++;
                    console.log(l,p);
                }
            }

            if (x==l.x2 && y==l.y2) {
                done=true;
            }
            else {
                if (l.x2 > l.x1) {
                    x++;
                }
                else if (l.x2 < l.x1) {
                    x--;
                }

                if (l.y2 > l.y1) {
                    y++;
                }
                else if (l.y2 < l.y1) {
                    y--;
                }
            }
        }
    });

    //console.log(points);

    console.log(`Lines overlap at ${overlap} points`);
});

function part1(numbers, boards) {
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let lines = [];

    arr.forEach(a => {
        let line=a.split(' -> ');
        let x1y1=getPoint(line[0]);
        let x2y2=getPoint(line[1]);
        lines.push({ x1: x1y1.x, y1: x1y1.y, x2: x2y2.x, y2: x2y2.y });
    });
   
    return lines;
}

function getPoint(point) {
    let xy=point.split(',');
    return { x: xy[0]*1, y: xy[1]*1 };
}
