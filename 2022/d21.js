const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};

fs.readFile(file, function(err, input) {
    if (err) throw err;

    parseInput(input);
    //console.log(JSON.stringify(data, null, 2));
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    let root = data.monkeys.find(m => m.name == 'root')
    console.log(calculate(root))
}

function part2() {
    console.log(`Processing Part 2`)
    let root = data.monkeys.find(m => m.name == 'root')
    root.math.op = '=';

    console.log('Calculating Right')
    let r = calculate(root.math.right, null);
    console.log(`Right is ${r}`)

    console.log('Calculating Left')
    let l = calculate(root.math.left, null);
    console.log(`Left is ${l}`)

    let humn = data.monkeys.find(m => m.math.left == 'humn' || m.math.right == 'humn')
    console.log(humn);

    let h = 0;
    if (humn.math.op == '-') h = calculate(root.math.left) - calculate(root.math.right);
    console.log(h);

    console.log('Right')
    let equation = [];
    console.log(calculate(root.math.right, null, equation))
    console.log(equation.find(e => e.lhumn || e.rhumn))

    console.log('Left')
    equation = [];
    console.log(calculate(root.math.left, null, equation))
    console.log(equation.find(e => e.lhumn || e.rhumn))

    let x = 'x';
    equation.forEach((e,i) => {
        if (i > 0 && equation[i-1].result == e.right) {
            x=`(${x}${e.op}${e.left})`
        }
        else {
            x = `(${x}${e.op}${e.right})`
        }
    })
    console.log(`${x}=${r}`)
    console.log(equation.forEach(e => console.log(`${e.left}${e.op}${e.right}=${e.result}`)));
    deriveX(equation, r);
}

function deriveX(equation, result) {
    console.log(`Deriving equation so that x produces result ${result}`)
    equation.reverse().forEach((e,i) => {
        if (i < equation.length-1) {
            let nextResult = equation[i+1].result;

            if (nextResult == e.left) {
                result = decalculate(result,e.right,e.op)
            }
            else {
                result = decalculate(result,e.left,e.op)
            }
        }
        else {
            if (e.rhumn) {
                result = decalculate(result,e.left,e.op)
            }
            else {
                result = decalculate(result,e.right,e.op)
            }
        }
    });

    console.log(`x is ${result}`)
}

function decalculate(a, b, op) {
    let result = 0;
    if (op == '-') result =  a+b;
    if (op == '+') result =  a-b;
    if (op == '*') result =  a/b;
    if (op == '/') result =  a*b;
    console.log(`${a}${op=='-'?'+':op=='+'?'-':op=='*'?'/':'*'}${b}`)
    return result;
}

function calculate(monkey, h, equation) {
    if (typeof monkey === 'string') {
        monkey = data.monkeys.find(m => m.name == monkey)
    }

    if (monkey.number == null) {
        let left = calculate(monkey.math.left, h, equation);
        let right = calculate(monkey.math.right, h, equation);


        let result = null;
        if (monkey.math.op == '+') result = left + right;
        if (monkey.math.op == '-') result = left - right;
        if (monkey.math.op == '/') result = left / right;
        if (monkey.math.op == '*') result = left * right;
        if (monkey.math.op == '=') result = left == right;


        if (equation != null) equation.push({ left: left, op: monkey.math.op, result: result, right: right, rhumn: monkey.math.right == 'humn', lhumn: monkey.math.left == 'humn' })
        //console.log(`${left}${monkey.math.op}${right}=${result}`)

        return result;
    }
    else {
        if (h != null && monkey.name == 'humn') return h;
        return monkey.number;
    }
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    data.monkeys = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            let l = line.split(': ')
            let monkey = {}
            monkey.name = l[0]
            monkey.number = null;
            monkey.math = {}

            let op = l[1].split(' ');
            if (op.length == 3) {
                monkey.math = { left: op[0], op: op[1], right: op[2] }
            }
            else {
                monkey.number = l[1] * 1;
            }

            data.monkeys.push(monkey)
        }
    });
}