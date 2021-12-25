const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const file = argv._[0] ?? 'q10sample.txt';

fs.readFile(file, function(err, input) {
    if(err) throw err;

    process(parseInput(input));
});

function process(results) {
    console.log(results);

    part2(results.filter(r => r.indexOf('Expected') == -1))
}

function part2(lines) {
    let totals=[];
    lines.forEach(l => {
        totals.push(l.split(' => ')[1].split('').reduce((t,c) => t*5+(c==')'?1:c==']'?2:c=='}'?3:4),0));
    });

    lines.forEach((l,i) => {
        console.log(l.split(' => ')[1] + ' => ' + totals[i])
    })

    console.log(totals);

    console.log(totals.sort((a,b) => a-b)[(totals.length-1)/2]);
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    let results = [];
    let cost = 0;

    arr.forEach(a => {
        let row = a.split('');
        let chunks = [];
        let fail = false;
        let result="";

        row.forEach(c => {
            if (!fail) {
                result += c;

                if (c == '[' || c == '{' || c == '<' || c == '(') chunks.push(c);
                else {
                    let top = chunks.pop();
                    let expect = top == '[' ? ']' : top == '{' ? '}' : top == '<' ? '>' : ')';

                    if (c != expect) {
                        result += ` Expected ${expect}, but found ${c} instead.`;
                        if (c == ')') cost += 3;
                        else if (c == ']') cost += 57;
                        else if (c == '}') cost += 1197;
                        else if (c == '>') cost += 25137;
                        fail = true;
                    }
                }
            }
        });
        results.push(result + ' => ' + chunks.reverse().map(c => c == '(' ? ')' : c == '[' ? ']' : c == '{' ? '}' : '>').join(''));
    });

    console.log(cost);
   
    return results;
}