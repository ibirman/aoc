const fs = require('fs');

fs.readFile('q4.txt', function(err, data) {
    if(err) throw err;

    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    //console.log(`Data length: ${arr.length}`);

    let numbers=arr[0].split(',');
    let boards=[]
    let b=-1;
    let row=0;

    for (i=2;i<arr.length;i++) {
        if (arr[i].length==0) {
            row=0;
            continue;
        }
        //console.log(i,(i-2)%5,arr[i]);

        if (row==0) {
            b++;
            boards.push({ board: b, rows: [], marks: [], bingo: false});
        }
        row++;
        let rowdata=arr[i].trim().replace(/  /g, " ").split(' ');
        boards[b].rows.push(rowdata);
        boards[b].marks.push([' ',' ',' ',' ',' ']);
    }

    console.log(part1(numbers, boards));

});

function part1(numbers, boards) {
    let bingo=false;
    let lastNumber=0;

    for (let i=0;i<numbers.length;i++) {
        let n=numbers[i];
        lastNumber=n*1;

        boards.filter(b => !b.bingo).forEach(b => {
            b.rows.forEach((r,i) => {
                r.forEach((d,j) => {
                    if (d*1==n*1) {
                        b.marks[i][j]='*';
                    }
                })
            })
        });

        for (let j=0;j<boards.length;j++) {
            if (boards[j].bingo) continue;

            let board=boards[j];

            if (checkForBingo(board)) {
                bingo=true;
                boards[j].bingo=true;
                console.log(`Bingo board: ${board.board}, number: ${n}, score: ${calculateScore(board,n)}`);
            }

        };
    };

    return bingo;
}

function checkForBingo(board) {
    bingo=false;

    // check across
    board.marks.forEach((mr,i) => {
        let rowMarkCount=0;
        mr.forEach(m => {
            if (m == '*') {
                rowMarkCount++;
            }
        });
        if (rowMarkCount==5) {
            bingo=true;
        }
    })

    // check down
    for (let r=0;r<5;r++) {
        let markCount=0;
        board.marks.forEach(mr => {
            if (mr[r]=='*') markCount++;
        });

        if (markCount==5) {
            bingo=true;
        }
    }

    // check diagonals
    //if (board.marks[0][0] == '*' && board.marks[1][1] == '*' && board.marks[2][2] == '*' && board.marks[3][3] == '*' && board.marks[4][4]=='*') bingo=true;
    //if (board.marks[4][0] == '*' && board.marks[3][1] == '*' && board.marks[2][2] == '*' && board.marks[1][3] == '*' && board.marks[0][4]=='*') bingo=true;

    return bingo;
}

function calculateScore(board, lastNumber) {
    let score=0;

    board.rows.forEach((r,i) => {
        r.forEach((n,j) => {
            if (board.marks[i][j]!='*') {
                score+=n*1;
            }
        });
    });

    return score*lastNumber;
}